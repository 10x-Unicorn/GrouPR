import React, { useState } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useChat from '../hooks/useChat';
import ChatHeader from '../components/ChatHeader';
import ChatMessage from '../components/ChatMessage';
import MessageInput from '../components/MessageInput';

export default function ChatScreen({ route, navigation }) {
  const { team } = route.params;
  const {
    messages,
    currentUser,
    teamMembers,
    loading,
    sendMessage,
    flatListRef
  } = useChat(team.$id);

  const [newMessage, setNewMessage] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = {
    background: isDark ? '#0f172a' : '#ffffff',
    cardBackground: isDark ? '#1e293b' : '#ffffff',
    border: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#ffffff' : '#1e293b',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    textMuted: isDark ? '#64748b' : '#94a3b8',
    inputBackground: isDark ? '#1e293b' : '#f8fafc',
    inputBorder: isDark ? '#475569' : '#cbd5e1',
    messageBackground: isDark ? '#334155' : '#e2e8f0',
    primary: '#3b82f6',
    primaryText: '#ffffff'
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim());
    setNewMessage('');
  };

  const getUserDisplayName = (userId, fallbackName) => {
    const member = teamMembers.find(m => m.userId === userId);
    return member?.userName || fallbackName || 'Unknown User';
  };

  const openTeamSettings = () => {
    navigation.navigate('TeamSettings', { team, teamMembers });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background }}
        edges={['top', 'left', 'right']} // Don't add bottom safe area
      >
        <ChatHeader
          team={team}
          teamMembers={teamMembers}
          onBack={() => navigation.goBack()}
          onSettings={openTeamSettings}
          theme={theme}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => (
              <ChatMessage
                item={item}
                index={index}
                messages={messages}
                currentUser={currentUser}
                theme={theme}
                getDisplayName={getUserDisplayName}
              />
            )}
            keyExtractor={(item) => item.$id}
            style={{ flex: 1 }}
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
              justifyContent: 'flex-start'
            }}
            onContentSizeChange={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            windowSize={50}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={20}
          />

          <MessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSend}
            theme={theme}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}