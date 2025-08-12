import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const IndividualWorkoutsTab = ({ navigation }) => {
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
          onPress={() => navigation.navigate('CreateIndividualWorkout')}
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="dumbbell" size={28} color={theme.getIconColor()} />
            <View className="ml-4">
              <Text className="text-lg font-semibold" style={{ color: theme.colors.text }}>Add Individual Workout</Text>
              <Text className="text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
                Create a single workout session
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={theme.getIconColor()} />
        </TouchableOpacity>

        <View className="mt-16">
          <Text className="text-lg font-semibold mb-4" style={{ color: theme.colors.textSecondary }}>
            Recent Individual Workouts
          </Text>
          <View className="rounded-xl p-6 border" style={{
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.border
          }}>
            <Text className="text-center italic" style={{ color: theme.colors.textSecondary }}>
              No individual workouts created yet. Add your first workout above!
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default IndividualWorkoutsTab;