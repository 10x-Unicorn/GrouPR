import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate, formatTime } from '../utils/formatters';

export default function ChatMessage({ item, index, messages, currentUser, theme, getDisplayName }) {
  const isCurrentUser = item.userId === currentUser?.$id;
  const previous = messages[index - 1];
  const showDate = index === 0 || formatDate(item.$createdAt) !== formatDate(previous?.$createdAt);

  return (
    <View>
      {showDate && (
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <View style={{
            backgroundColor: theme.messageBackground,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20
          }}>
            <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: '500' }}>
              {formatDate(item.$createdAt)}
            </Text>
          </View>
        </View>
      )}

      <View style={{
        flexDirection: 'row',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        marginBottom: 12
      }}>
        <View style={{
          maxWidth: '75%',
          padding: 12,
          borderRadius: 16,
          backgroundColor: isCurrentUser ? theme.primary : theme.messageBackground,
          borderBottomRightRadius: isCurrentUser ? 4 : 16,
          borderBottomLeftRadius: isCurrentUser ? 16 : 4,
          opacity: item.sending ? 0.7 : 1
        }}>
          {!isCurrentUser && (
            <Text style={{ fontSize: 12, fontWeight: '600', color: theme.textMuted, marginBottom: 4 }}>
              {getDisplayName(item.userId, item.userName)}
            </Text>
          )}
          <Text style={{ fontSize: 16, color: isCurrentUser ? theme.primaryText : theme.text }}>
            {item.message}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4, gap: 4 }}>
            <Text style={{ fontSize: 12, color: isCurrentUser ? 'rgba(255,255,255,0.7)' : theme.textMuted }}>
              {formatTime(item.$createdAt)}
            </Text>
            {isCurrentUser && (
              <MaterialCommunityIcons
                name={item.sending ? 'clock-outline' : 'check'}
                size={12}
                color="rgba(255,255,255,0.7)"
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
