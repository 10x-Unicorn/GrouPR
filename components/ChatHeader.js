import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChatHeader({ team, teamMembers, onBack, onSettings, theme }) {
  return (
    <View style={{
      backgroundColor: theme.cardBackground,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <TouchableOpacity onPress={onBack} style={{ padding: 8, marginRight: 16 }}>
        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textSecondary} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>
          {team.name}
        </Text>
        <Text style={{ fontSize: 14, color: theme.textSecondary }}>
          {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity onPress={onSettings} style={{ padding: 8 }}>
        <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}
