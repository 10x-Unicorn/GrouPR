import {
  databases,
  account,
  teams,
  client,
  ID,
  Permission,
  Role,
  DATABASE_ID,
  COLLECTIONS,
  Query
} from '../lib/appwrite';

export const chatService = {
  // Initialize properties
  currentUser: null,
  activeSubscriptions: new Map(),

  // 🧠 Fetch and cache current user
  async getCurrentUser(forceRefresh = false) {
    if (!this.currentUser || forceRefresh) {
      this.currentUser = await account.get();
    }
    return this.currentUser;
  },

  // 💬 Load last 50 chat messages
  async getMessages(teamId, limit = 50) {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.CHAT_MESSAGES,
      [
        Query.equal('teamId', teamId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );
    return res.documents.reverse();
  },

  // 📨 Send message - Fixed method name to match useChat hook
  async sendMessageToTeam({ teamId, userId, userName, message }) {
    // Use cached user if userId not provided
    if (!userId && this.currentUser) {
      userId = this.currentUser.$id;
      userName = userName || this.currentUser.name;
    }

    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CHAT_MESSAGES,
      ID.unique(),
      {
        teamId,
        userId,
        userName,
        message
      },
      [
        Permission.read(Role.team(teamId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId))
      ]
    );
  },

  // 🔁 Subscribe to real-time updates with automatic cleanup
  subscribeToChat(teamId, callback) {
    // Unsubscribe existing subscription for this team
    this.unsubscribeFromChat(teamId);

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.CHAT_MESSAGES}.documents`,
      (response) => {
        const message = response.payload;
        if (message.teamId === teamId) {
          callback(response);
        }
      }
    );

    // Store subscription for cleanup
    this.activeSubscriptions.set(teamId, unsubscribe);
    return unsubscribe;
  },

  // 🚫 Unsubscribe from specific team chat
  unsubscribeFromChat(teamId) {
    const unsubscribe = this.activeSubscriptions.get(teamId);
    if (unsubscribe) {
      unsubscribe();
      this.activeSubscriptions.delete(teamId);
    }
  },

  // 🧹 Clean up all subscriptions
  cleanup() {
    this.activeSubscriptions.forEach(unsubscribe => unsubscribe());
    this.activeSubscriptions.clear();
    this.currentUser = null;
  },

  // 📊 Get subscription status
  getActiveSubscriptions() {
    return Array.from(this.activeSubscriptions.keys());
  }
};