import { teams, databases, account, ID, Permission, Role, DATABASE_ID, COLLECTIONS} from '../lib/appwrite';

export const teamService = {
    /**
     * Create a new team
     */
    async createTeam(name) {
        try {
            const team = await teams.create(ID.unique(), name.trim());
            return team;
        } catch (error) {
            console.error('Failed to create team:', error);
            throw new Error('Failed to create group. Please try again.');
        }
    },

    /**
     * Send invitations to multiple email addresses
     */
    async inviteMembers(teamId, emails) {
        const results = [];
        
        for (const email of emails) {
            try {
                const invitation = await teams.createMembership(
                    teamId,
                    ['member'], // Default role for invited users
                    email.trim(),
                    undefined,
                    undefined,
                    'http://192.168.1.167:8081/accept-invite'
                );
                results.push({ email, success: true, invitation });
            } catch (error) {
                console.error(`Failed to invite ${email}:`, error);
                results.push({ email, success: false, error: error.message });
            }
        }
        
        return results;
    },

    /**in
     * Get all teams the current user belongs to
     */
    async getUserTeams() {
        try {
            const response = await teams.list();
            return response.teams || [];
        } catch (error) {
            console.error('Failed to load user teams:', error);
            throw new Error('Failed to load your groups');
        }
    },

    /**
     * Get members of a specific team
     */
    async getTeamMembers(teamId) {
        try {
            const response = await teams.listMemberships(teamId);
            return response.memberships || [];
        } catch (error) {
            console.error('Failed to load team members:', error);
            throw new Error('Failed to load team members');
        }
    },

    /**
     * Remove a member from a team
     */
    async removeMember(teamId, membershipId) {
        try {
            await teams.deleteMembership(teamId, membershipId);
            return true;
        } catch (error) {
            console.error('Failed to remove member:', error);
            throw new Error('Failed to remove member');
        }
    },

    /**
     * Update member roles
     */
    async updateMemberRoles(teamId, membershipId, roles) {
        try {
            const membership = await teams.updateMembershipRoles(teamId, membershipId, roles);
            return membership;
        } catch (error) {
            console.error('Failed to update member roles:', error);
            throw new Error('Failed to update member roles');
        }
    },

    /**
     * Delete a team (only team owner can do this)
     */
    async deleteTeam(teamId) {
        try {
            await teams.delete(teamId);
            return true;
        } catch (error) {
            console.error('Failed to delete team:', error);
            throw new Error('Failed to delete group');
        }
    },

    /**
     * Leave a team
     */
    async leaveTeam(teamId, membershipId) {
        try {
            await teams.deleteMembership(teamId, membershipId);
            return true;
        } catch (error) {
            console.error('Failed to leave team:', error);
            throw new Error('Failed to leave group');
        }
    },

    /**
     * Get current user info
     */
    async getCurrentUser() {
        try {
            const user = await account.get();
            return user;
        } catch (error) {
            console.error('Failed to get current user:', error);
            throw new Error('Failed to get user information');
        }
    },

    /**
     * Send a message to a team chat
     */
    async sendMessage(teamId, message, user) {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CHAT_MESSAGES,
                ID.unique(),
                {
                    message: message.trim(),
                    userId: user.$id,
                    userName: user.name || user.email,
                    teamId: teamId
                },
                [
                    Permission.read(Role.team(teamId)), // Only team members can read
                    Permission.update(Role.user(user.$id)), // Only sender can update
                    Permission.delete(Role.user(user.$id))  // Only sender can delete
                ]
            );
            return response;
        } catch (error) {
            console.error('Failed to send message:', error);
            throw new Error('Failed to send message');
        }
    },

    /**
     * Load messages for a team
     */
    async getTeamMessages(teamId, limit = 50) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CHAT_MESSAGES,
                [
                    Query.equal('teamId', teamId),
                    Query.orderDesc('$createdAt'),
                    Query.limit(limit)
                ]
            );
            
            // Return messages in chronological order (oldest first)
            return response.documents.reverse();
        } catch (error) {
            console.error('Failed to load team messages:', error);
            throw new Error('Failed to load messages');
        }
    },

    async acceptInvitation(teamId, membershipId, userId, secret) {
        try {
            const response = await teams.updateMembershipStatus(
                teamId,
                membershipId,
                userId,
                secret
            );
            return response;
        } catch (error) {
            console.error('Failed to accept invitation:', error);
            throw error;
        }
    },

    parseInviteUrl(url) {
        try {
            const urlObj = new URL(url);
            const searchParams = urlObj.searchParams;
            
            return {
                teamId: searchParams.get('teamId'),
                membershipId: searchParams.get('membershipId'),
                userId: searchParams.get('userId'),
                secret: searchParams.get('secret')
            };
        } catch (error) {
            console.error('Failed to parse invite URL:', error);
            return null;
        }
    }
};

// Utility functions for validation
export const teamValidation = {
    /**
     * Validate team name
     */
    validateTeamName(name) {
        if (!name || !name.trim()) {
            return { valid: false, error: 'Group name is required' };
        }
        
        if (name.trim().length < 2) {
            return { valid: false, error: 'Group name must be at least 2 characters' };
        }
        
        if (name.trim().length > 100) {
            return { valid: false, error: 'Group name must be less than 100 characters' };
        }
        
        return { valid: true };
    },

    /**
     * Validate email address
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },

    /**
     * Validate array of emails
     */
    validateEmails(emails) {
        const validEmails = emails.filter(email => email.trim() !== '');
        const invalidEmails = [];
        
        for (const email of validEmails) {
            if (!this.validateEmail(email)) {
                invalidEmails.push(email);
            }
        }
        
        if (invalidEmails.length > 0) {
            return {
                valid: false,
                error: `Invalid email addresses: ${invalidEmails.join(', ')}`
            };
        }
        
        return { valid: true, validEmails };
    }
};