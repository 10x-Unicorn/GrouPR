import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const CreateWorkoutPlanScreen = ({ navigation }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const theme = useTheme();

  const handleCreate = () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    Alert.alert(
      'Success',
      `Workout Plan "${workoutName}" created successfully!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <ScrollView className="flex-1 p-6">
        <View className="space-y-4">
          <View>
            <Text className="text-lg font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
              Name
            </Text>
            <TextInput
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.backgroundTertiary,
                color: theme.colors.text
              }}
              placeholder="Enter workout plan name"
              placeholderTextColor={theme.colors.textTertiary}
              value={workoutName}
              onChangeText={setWorkoutName}
            />
          </View>

          <View>
            <Text className="text-lg font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
              Description
            </Text>
            <TextInput
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.backgroundTertiary,
                color: theme.colors.text,
                height: 96
              }}
              placeholder="Enter description (optional)"
              placeholderTextColor={theme.colors.textTertiary}
              value={workoutDescription}
              onChangeText={setWorkoutDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View className="flex-row space-x-4 p-6">
        <TouchableOpacity
          className="flex-1 rounded-xl p-4"
          style={{ backgroundColor: theme.colors.gray200 }}
          onPress={() => navigation.goBack()}
        >
          <Text className="text-center font-semibold" style={{ color: theme.colors.gray700 }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 rounded-xl p-4"
          style={{ backgroundColor: theme.colors.gray600 }}
          onPress={handleCreate}
        >
          <Text className="text-white text-center font-semibold">
            Create
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateWorkoutPlanScreen;