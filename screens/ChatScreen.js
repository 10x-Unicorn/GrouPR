import React, { useState, useEffect, useRef } from 'react';

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { databases, account, Query, ID } from '../lib/appwrite';

const DATABASE_ID = 'groupr_db'; 
const COLLECTION_ID = 'chat_messages';

export default function ChatScreen() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        initializeChat();

        // Subscribe to real-time updates
        const unsubscribe = databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.orderDesc('$createdAt'), Query.limit(50)]
        );

        return () => {
            // Cleanup subscription if needed
        };
    }, []);

    const initializeChat = async () => {
        try {
            // Get current user
            const user = await account.get();
            setCurrentUser(user);

            // Load existing messages
            await loadMessages();
        } catch (error) {
            console.error('Failed to initialize chat:', error);
            Alert.alert('Error', 'Failed to load chat');
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.orderDesc('$createdAt'), Query.limit(50)]
            );

            // Reverse to show oldest first
            setMessages(response.documents.reverse());
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !currentUser) return;

        const messageText = newMessage.trim();
        setNewMessage('');

        // Optimistic update
        const tempMessage = {
            $id: `temp-${Date.now()}`,
            message: messageText,
            userId: currentUser.$id,
            userName: currentUser.name || currentUser.email,
            $createdAt: new Date().toISOString(),
            sending: true
        };

        setMessages(prev => [...prev, tempMessage]);
        scrollToBottom();

        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    message: messageText,
                    userId: currentUser.$id,
                    userName: currentUser.name || currentUser.email
                }
            );

            // Replace temp message with real one
            setMessages(prev =>
                prev.map(msg =>
                    msg.$id === tempMessage.$id
                        ? { ...response, sending: false }
                        : msg
                )
            );
        } catch (error) {
            console.error('Failed to send message:', error);

            // Remove failed message and show error
            setMessages(prev => prev.filter(msg => msg.$id !== tempMessage.$id));
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const renderMessage = ({ item, index }) => {
        const isCurrentUser = item.userId === currentUser?.$id;
        const previousMessage = messages[index - 1];
        const showDateSeparator = index === 0 ||
            formatDate(item.$createdAt) !== formatDate(previousMessage?.$createdAt);

        return (
            <View>
                {/* Date Separator */}
                {showDateSeparator && (
                    <View className="items-center my-4">
                        <View className="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">
                            <Text className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                {formatDate(item.$createdAt)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Message */}
                <View className={`flex-row mb-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <View
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${isCurrentUser
                                ? 'bg-blue-500 rounded-br-md'
                                : 'bg-slate-200 dark:bg-slate-700 rounded-bl-md'
                            } ${item.sending ? 'opacity-70' : ''}`}
                    >
                        {!isCurrentUser && (
                            <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                                {item.userName}
                            </Text>
                        )}

                        <Text className={`text-base ${isCurrentUser
                                ? 'text-white'
                                : 'text-slate-800 dark:text-white'
                            }`}>
                            {item.message}
                        </Text>

                        <View className={`flex-row items-center justify-end mt-1 ${isCurrentUser ? 'space-x-1' : ''
                            }`}>
                            <Text className={`text-xs ${isCurrentUser
                                    ? 'text-blue-100'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                {formatTime(item.$createdAt)}
                            </Text>

                            {isCurrentUser && (
                                <MaterialCommunityIcons
                                    name={item.sending ? "clock-outline" : "check"}
                                    size={12}
                                    color="rgba(255,255,255,0.7)"
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
                <Text className="text-lg text-slate-600 dark:text-slate-300">Loading chat...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white dark:bg-slate-900"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            {/* Messages List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.$id}
                className="flex-1 px-4"
                contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
                onContentSizeChange={scrollToBottom}
            />

            {/* Message Input */}
            <View
                className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3"
                style={{ paddingBottom: Math.max(insets.bottom, 12) }}
            >
                <View className="flex-row items-end space-x-3">
                    <View className="flex-1 min-h-[44px] max-h-[100px]">
                        <TextInput
                            className="flex-1 border border-slate-300 dark:border-slate-600 rounded-full px-4 py-3 text-base bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="Type a message..."
                            placeholderTextColor="#64748b"
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                            maxLength={1000}
                            returnKeyType="send"
                            onSubmitEditing={sendMessage}
                            blurOnSubmit={false}
                        />
                    </View>

                    <TouchableOpacity
                        className={`w-11 h-11 rounded-full items-center justify-center ${newMessage.trim()
                                ? 'bg-blue-500 active:bg-blue-600'
                                : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                        onPress={sendMessage}
                        disabled={!newMessage.trim()}
                    >
                        <MaterialCommunityIcons
                            name="send"
                            size={20}
                            color={newMessage.trim() ? '#ffffff' : '#64748b'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}