import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 16 }}>
      <MaterialCommunityIcons name="account-circle" size={28} color="#2563eb" />
    </TouchableOpacity>
  );
}