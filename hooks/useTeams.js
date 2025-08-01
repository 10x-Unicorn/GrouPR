import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { teamService, teamValidation } from '../services/teamService';

export const useTeams = () => {
    const [teams, setTeams] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Load initial data
    useEffect(() => {
        initializeTeams();
    }, []);

    const initializeTeams = async () => {
        try {
            setError(null);
            const user = await teamService.getCurrentUser();
            setCurrentUser(user);
            await loadTeams();
        } catch (error) {
            console.error('Failed to initialize teams:', error);
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadTeams = async () => {
        try {
            const userTeams = await teamService.getUserTeams();
            setTeams(userTeams.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)));
        } catch (error) {
            console.error('Failed to load teams:', error);
            throw error;
        }
    };

    const refreshTeams = useCallback(async () => {
        setRefreshing(true);
        try {
            await loadTeams();
            setError(null);
        } catch (error) {
            setError(error.message);
            Alert.alert('Error', error.message);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const createTeam = async (name, emails = []) => {
        try {
            // Validate team name
            const nameValidation = teamValidation.validateTeamName(name);
            if (!nameValidation.valid) {
                Alert.alert('Invalid Name', nameValidation.error);
                return null;
            }

            // Validate emails if provided
            const validEmails = emails.filter(email => email.trim() !== '');
            if (validEmails.length > 0) {
                const emailValidation = teamValidation.validateEmails(validEmails);
                if (!emailValidation.valid) {
                    Alert.alert('Invalid Email', emailValidation.error);
                    return null;
                }
            }

            // Create the team
            const team = await teamService.createTeam(name);

            // Send invitations if emails were provided
            if (validEmails.length > 0) {
                const inviteResults = await teamService.inviteMembers(team.$id, validEmails);
                
                // Show results of invitations
                const successCount = inviteResults.filter(r => r.success).length;
                const failCount = inviteResults.filter(r => !r.success).length;
                
                let message = `Group "${name}" created successfully!`;
                if (successCount > 0) {
                    message += ` ${successCount} invitation${successCount > 1 ? 's' : ''} sent.`;
                }
                if (failCount > 0) {
                    message += ` ${failCount} invitation${failCount > 1 ? 's' : ''} failed.`;
                }
                
                Alert.alert('Success', message);
            } else {
                Alert.alert('Success', `Group "${name}" created successfully!`);
            }

            // Refresh the teams list
            await loadTeams();
            return team;

        } catch (error) {
            console.error('Failed to create team:', error);
            Alert.alert('Error', error.message);
            return null;
        }
    };

    const deleteTeam = async (teamId, teamName) => {
        return new Promise((resolve) => {
            Alert.alert(
                'Delete Group',
                `Are you sure you want to delete "${teamName}"? This action cannot be undone.`,
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await teamService.deleteTeam(teamId);
                                await loadTeams();
                                Alert.alert('Success', 'Group deleted successfully');
                                resolve(true);
                            } catch (error) {
                                Alert.alert('Error', error.message);
                                resolve(false);
                            }
                        }
                    }
                ]
            );
        });
    };

    const leaveTeam = async (teamId, teamName) => {
        return new Promise((resolve) => {
            Alert.alert(
                'Leave Group',
                `Are you sure you want to leave "${teamName}"?`,
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
                    {
                        text: 'Leave',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                // First, get current user's membership
                                const members = await teamService.getTeamMembers(teamId);
                                const userMembership = members.find(m => m.userId === currentUser.$id);
                                
                                if (userMembership) {
                                    await teamService.leaveTeam(teamId, userMembership.$id);
                                    await loadTeams();
                                    Alert.alert('Success', 'Left group successfully');
                                    resolve(true);
                                } else {
                                    Alert.alert('Error', 'You are not a member of this group');
                                    resolve(false);
                                }
                            } catch (error) {
                                Alert.alert('Error', error.message);
                                resolve(false);
                            }
                        }
                    }
                ]
            );
        });
    };

    return {
        // State
        teams,
        currentUser,
        loading,
        refreshing,
        error,

        // Actions
        refreshTeams,
        createTeam,
        deleteTeam,
        leaveTeam,
        
        // Utility
        reloadTeams: loadTeams
    };
};