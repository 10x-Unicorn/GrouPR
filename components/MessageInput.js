import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MessageInput({ value, onChange, onSend, theme }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'flex-end',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
      padding: 12
    }}>
      <TextInput
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: theme.inputBorder,
          borderRadius: 22,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          backgroundColor: theme.inputBackground,
          color: theme.text
        }}
        placeholder="Type a message..."
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChange}
        multiline
        onSubmitEditing={onSend}
        blurOnSubmit={false}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!value.trim()}
        style={{
          marginLeft: 12,
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: value.trim() ? theme.primary : theme.messageBackground
        }}
      >
        <MaterialCommunityIcons
          name="send"
          size={20}
          color={value.trim() ? theme.primaryText : theme.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}
