import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { teamService } from '../services/teamService';

export default function AcceptInviteScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [inviteData, setInviteData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('AcceptInviteScreen route params:', route.params);
        
        // Parse invite parameters from route params
        const params = route.params || {};
        
        // Check if we have the required parameters
        if (params.teamId && params.membershipId && params.userId && params.secret) {
            setInviteData({
                teamId: params.teamId,
                membershipId: params.membershipId,
                userId: params.userId,
                secret: params.secret,
                teamName: params.teamName || 'Unknown Team'
            });
        } else if (params.inviteUrl) {
            // If we have an inviteUrl, parse it
            const parsed = teamService.parseInviteUrl(params.inviteUrl);
            if (parsed) {
                setInviteData(parsed);
            } else {
                setError('Could not parse invitation URL');
            }
        } else {
            console.error('Missing required parameters:', params);
            setError('Invalid invitation link - missing required parameters');
        }
    }, [route.params]);

    const handleAcceptInvite = async () => {
        if (!inviteData) {
            Alert.alert('Error', 'No invitation data available');
            return;
        }

        setLoading(true);
        try {
            console.log('Accepting invite with data:', inviteData);
            
            await teamService.acceptInvitation(
                inviteData.teamId,
                inviteData.membershipId,
                inviteData.userId,
                inviteData.secret
            );

            Alert.alert(
                'Success!',
                `You have successfully joined ${inviteData.teamName || 'the team'}.`,
                [
                    {
                        text: 'View Teams',
                        onPress: () => {
                            console.log('Navigation state before:', navigation.getState());
                            
                            // Try multiple navigation approaches
                            try {
                                // Method 1: Go back to root and then navigate
                                navigation.navigate('MainTabs', { screen: 'Groups' });
                            } catch (error) {
                                console.log('Navigation method 1 failed:', error);
                                // Method 2: Direct navigation
                                navigation.navigate('Groups');
                            }
                        }
                    }
                ]
            );
        } catch (error) {
            if (error.code === 409) {
                Alert.alert('Already Joined', 'You are already a member of this team.');
                navigation.navigate('MainTabs', { screen: 'Groups' });
            }else{
                console.error('Error accepting invitation:', error);
                Alert.alert('Error', error.message || 'Failed to accept invitation');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleDecline = () => {
        console.log('Declining invite, showing confirmation dialog');
        
        if (Platform.OS === 'web') {
            // Use browser's native confirm for web
            const confirmed = window.confirm('Are you sure you want to decline this invitation?');
            if (confirmed) {
                console.log('Declining invite, navigating to home');
                try {
                    navigation.navigate('MainTabs', { screen: 'Home' });
                } catch (error) {
                    console.log('Navigation method 1 failed:', error);
                    navigation.navigate('Home');
                }
            }
        } else {
            // Use React Native Alert for mobile
            Alert.alert(
                'Decline Invitation',
                'Are you sure you want to decline this invitation?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Decline', 
                        style: 'destructive',
                        onPress: () => {
                            console.log('Declining invite, navigating to home');
                            try {
                                navigation.navigate('MainTabs', { screen: 'Home' });
                            } catch (error) {
                                console.log('Navigation method 1 failed:', error);
                                navigation.navigate('Home');
                            }
                        }
                    }
                ]
            );
        }
    };

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900 px-6">
                <MaterialCommunityIcons 
                    name="alert-circle" 
                    size={64} 
                    color="#ef4444"
                />
                <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center mt-4">
                    Invalid Invitation
                </Text>
                <Text className="text-slate-600 dark:text-slate-400 text-center mb-6">
                    {error}
                </Text>
                <TouchableOpacity
                    className="bg-blue-500 px-6 py-3 rounded-lg"
                    onPress={() => {
                        console.log('Error screen - navigating to home');
                        
                        try {
                            navigation.popToTop();
                            setTimeout(() => {
                                navigation.navigate('MainTabs', { 
                                    screen: 'Home' 
                                });
                            }, 100);
                        } catch (error) {
                            console.log('Navigation failed:', error);
                            navigation.navigate('Home');
                        }
                    }}
                >
                    <Text className="text-white font-semibold">Go to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!inviteData) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-slate-600 dark:text-slate-400 mt-4">
                    Loading invitation...
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900 px-6">
            <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-sm">
                <View className="items-center mb-6">
                    <View className="w-16 h-16 bg-blue-500 dark:bg-sky-400 rounded-full items-center justify-center mb-4">
                        <MaterialCommunityIcons 
                            name="account-group" 
                            color="white" 
                            size={32} 
                        />
                    </View>
                    <Text className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">
                        Team Invitation
                    </Text>
                    <Text className="text-slate-600 dark:text-slate-400 text-center">
                        You've been invited to join{'\n'}
                        <Text className="font-semibold text-blue-600 dark:text-sky-400">
                            {inviteData.teamName || 'a team'}
                        </Text>
                    </Text>
                </View>

                <View className="space-y-3">
                    <TouchableOpacity
                        className={`bg-blue-500 py-3 rounded-lg flex-row items-center justify-center ${loading ? 'opacity-50' : ''}`}
                        onPress={handleAcceptInvite}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <MaterialCommunityIcons 
                                    name="check" 
                                    color="white" 
                                    size={20} 
                                    style={{ marginRight: 8 }}
                                />
                                <Text className="text-white font-semibold">Accept Invitation</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="border border-slate-300 dark:border-slate-600 py-3 rounded-lg flex-row items-center justify-center"
                        onPress={handleDecline}
                        disabled={loading}
                    >
                        <MaterialCommunityIcons 
                            name="close" 
                            color="#64748b" 
                            size={20} 
                            style={{ marginRight: 8 }}
                        />
                        <Text className="text-slate-600 dark:text-slate-400 font-semibold">Decline</Text>
                    </TouchableOpacity>
                </View>

                {/* Debug info in development */}
                {__DEV__ && (
                    <View className="mt-4 p-2 bg-slate-100 dark:bg-slate-700 rounded">
                        <Text className="text-xs text-slate-600 dark:text-slate-400">
                            Debug: {JSON.stringify(inviteData, null, 2)}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}