import { useEffect, useRef, useState } from 'react';
import { chatService } from '../services/chatService';

import { teamService } from '../services/teamService';

export default function useChat(teamId) {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    loadChatData();

    // Clean up real-time subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current(); // unsubscribe
      }
    };
  }, [teamId]);

  const loadChatData = async () => {
    try {
      const [user, members, msgs] = await Promise.all([
        chatService.getCurrentUser(),
        teamService.getTeamMembers(teamId),
        chatService.getMessages(teamId)
      ]);

      setCurrentUser(user);
      setTeamMembers(
        members.map((m) => ({
          userId: m.userId,
          userName: m.userName
        }))
      );
      setMessages(msgs);
      subscribeToMessages();
    } catch (err) {
      console.error('Error loading chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    subscriptionRef.current = chatService.subscribeToChat(teamId, (res) => {
      if (res.events.includes('databases.*.collections.*.documents.*.create')) {
        setMessages((prev) => [...prev, res.payload]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });
  };

  const sendMessage = async (text) => {
    if (!currentUser) return;

    try {
      await chatService.sendMessageToTeam({
        teamId,
        userId: currentUser.$id,
        userName: currentUser.name,
        message: text
      });
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  return {
    messages,
    currentUser,
    teamMembers,
    loading,
    sendMessage,
    flatListRef
  };
}
