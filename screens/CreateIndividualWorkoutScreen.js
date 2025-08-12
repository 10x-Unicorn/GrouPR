import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const CreateIndividualWorkoutScreen = ({ navigation, route }) => {
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDescription, setWorkoutDescription] = useState('');
  const [exercises, setExercises] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (route.params?.selectedExercises) {
      setExercises(route.params.selectedExercises);
    }
  }, [route.params?.selectedExercises]);

  const handleAddExercises = () => {
    navigation.navigate('AddExercisesScreen', { 
      selectedExercises: exercises
    });
  };

  const handleCreate = () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    Alert.alert(
      'Success',
      `Individual Workout "${workoutName}" created successfully with ${exercises.length} exercises!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <ScrollView className="flex-1 p-6">
        <View className="space-y-4">
          <View>
            <Text className="text-lg font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
              Workout Name
            </Text>
            <TextInput
              className="border rounded-xl p-4"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.backgroundTertiary,
                color: theme.colors.text
              }}
              placeholder="Enter workout name"
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

          <View>
            <Text className="text-lg font-semibold mb-2" style={{ color: theme.colors.textSecondary }}>
              Exercises
            </Text>
            <TouchableOpacity
              className="border rounded-xl p-4 flex-row items-center justify-center space-x-2"
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.backgroundTertiary
              }}
              onPress={handleAddExercises}
            >
              <MaterialCommunityIcons 
                name="plus" 
                size={20} 
                color={theme.colors.textSecondary} 
              />
              <Text 
                className="text-base font-medium"
                style={{ color: theme.colors.textSecondary }}
              >
                Add Exercises
              </Text>
              {exercises.length > 0 && (
                <View 
                  className="rounded-full px-2 py-1 ml-2"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Text className="text-white text-sm font-semibold">
                    {exercises.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            {exercises.length > 0 && (
              <View className="mt-2 space-y-1">
                {exercises.map((exercise, index) => (
                  <View key={index} className="flex-row items-center">
                    <MaterialCommunityIcons 
                      name="dumbbell" 
                      size={16} 
                      color={theme.colors.textTertiary} 
                    />
                    <Text 
                      className="ml-2 text-sm"
                      style={{ color: theme.colors.textTertiary }}
                    >
                      {exercise.name || exercise}
                    </Text>
                  </View>
                ))}
              </View>
            )}
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
            Create Workout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateIndividualWorkoutScreen;