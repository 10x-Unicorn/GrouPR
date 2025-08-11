import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const WorkoutPlansTab = ({ navigation }) => {
  const theme = useTheme();

  return (
    <ScrollView className="flex-1 px-6">
      <View className="mt-6">
        <TouchableOpacity
          className="rounded-xl p-6 flex-row items-center justify-between border"
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderColor: theme.colors.border
          }}
          onPress={() => navigation.navigate('CreateWorkoutPlan')}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="calendar-multiple" size={28} color={theme.getIconColor()} />
            <View className="ml-4">
              <Text className="text-lg font-semibold" style={{ color: theme.colors.text }}>Create Workout Plan</Text>
              <Text className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
                Build a structured training program
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.getIconColor()} />
        </TouchableOpacity>

        <View className="mt-16">
          <Text className="text-lg font-semibold mb-4" style={{ color: theme.colors.textSecondary }}>
            Your Workout Plans
          </Text>
          <View className="rounded-xl p-6 border" style={{
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.border
          }}>
            <Text className="text-center italic" style={{ color: theme.colors.textSecondary }}>
              No workout plans created yet. Create your first plan above!
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default WorkoutPlansTab;