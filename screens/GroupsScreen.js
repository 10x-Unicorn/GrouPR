import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    FlatList,
    RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTeams } from '../hooks/useTeams.js';
import CreateGroupForm from '../components/CreateGroupForm.js';

export default function GroupsScreen({ navigation }) {
    const [showCreateGroup, setShowCreateGroup] = useState(false);
    const { teams, loading, refreshing, refreshTeams, createTeam } = useTeams();
    const insets = useSafeAreaInsets();

    const handleGroupCreated = (team) => {
        setShowCreateGroup(false);
        navigation.navigate('ChatScreen', { team });
    };

    const handleGroupSelected = (team) => {
        navigation.navigate('ChatScreen', { team });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderGroupItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-3 border border-slate-200 dark:border-slate-700 shadow-sm"
            onPress={() => handleGroupSelected(item)}
            activeOpacity={0.7}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {item.name}
                    </Text>
                    <Text className="text-sm text-slate-500 dark:text-slate-400">
                        {item.total} members • Created {formatDate(item.$createdAt)}
                    </Text>
                </View>
                <View className="ml-3">
                    <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center">
                        <MaterialCommunityIcons 
                            name="account-group" 
                            size={24} 
                            color="#3b82f6" 
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Loading State
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-slate-50 dark:bg-slate-900">
                <MaterialCommunityIcons name="loading" size={48} color="#64748b" />
                <Text className="text-lg text-slate-600 dark:text-slate-300 mt-4">
                    Loading groups...
                </Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-50 dark:bg-slate-900"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ paddingTop: insets.top }}
        >
            {/* Header */}
            <View className="bg-white dark:bg-slate-800 px-4 py-4 border-b border-slate-200 dark:border-slate-700 flex-row items-center justify-between">
                {showCreateGroup ? (
                    <View className="flex-1 flex-row items-center">
                        <TouchableOpacity
                            onPress={() => setShowCreateGroup(false)}
                            className="mr-4 p-2"
                        >
                            <MaterialCommunityIcons 
                                name="arrow-left" 
                                size={24} 
                                color="#64748b" 
                            />
                        </TouchableOpacity>
                        <Text className="text-xl font-semibold text-slate-900 dark:text-white">
                            Create Group
                        </Text>
                    </View>
                ) : (
                    <>
                        <View className="flex-1">
                            <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                                Your Groups
                            </Text>
                            <Text className="text-sm text-slate-500 dark:text-slate-400">
                                {teams.length === 0 ? 'Create your first group' : 'Select a group to start chatting'}
                            </Text>
                        </View>
                        {teams.length > 0 && (
                            <TouchableOpacity
                                className="bg-blue-500 p-3 rounded-xl active:bg-blue-600"
                                onPress={() => setShowCreateGroup(true)}
                            >
                                <MaterialCommunityIcons name="plus" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>

            {/* Content */}
            {showCreateGroup ? (
                <CreateGroupForm 
                    onGroupCreated={handleGroupCreated}
                    onCancel={() => setShowCreateGroup(false)}
                    createTeam={createTeam}
                />
            ) : teams.length === 0 ? (
                // Empty State
                <View className="flex-1 justify-center items-center px-8">
                    <View className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mb-6">
                        <MaterialCommunityIcons 
                            name="account-group-outline" 
                            size={48} 
                            color="#64748b" 
                        />
                    </View>
                    <Text className="text-xl font-semibold text-slate-900 dark:text-white mb-2 text-center">
                        Welcome to Groups!
                    </Text>
                    <Text className="text-base text-slate-500 dark:text-slate-400 text-center mb-8 leading-6">
                        Create your first group to start chatting with friends and organizing activities together.
                    </Text>
                    <TouchableOpacity
                        className="bg-blue-500 px-8 py-4 rounded-xl flex-row items-center active:bg-blue-600"
                        onPress={() => setShowCreateGroup(true)}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="white" />
                        <Text className="text-white font-semibold text-lg ml-2">
                            Create Your First Group
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Groups List
                <View className="flex-1">
                    <FlatList
                        data={teams}
                        renderItem={renderGroupItem}
                        keyExtractor={(item) => item.$id}
                        contentContainerStyle={{ padding: 16 }}
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={refreshTeams} 
                            />
                        }
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Create New Group Button */}
                    <View className="p-4">
                        <TouchableOpacity
                            className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center active:bg-blue-600"
                            onPress={() => setShowCreateGroup(true)}
                        >
                            <MaterialCommunityIcons name="plus" size={24} color="white" />
                            <Text className="text-white font-semibold text-lg ml-2">
                                Create New Group
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}