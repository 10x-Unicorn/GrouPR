import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const AddExercisesScreen = ({ navigation, route }) => {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Pre-defined exercise library
  const exerciseLibrary = [
    { id: 1, name: 'Squat', category: 'Legs', muscle: 'Quadriceps' },
    { id: 2, name: 'Bench Press', category: 'Chest', muscle: 'Pectorals' },
    { id: 3, name: 'Deadlift', category: 'Back', muscle: 'Hamstrings' },
    { id: 4, name: 'Pull-ups', category: 'Back', muscle: 'Latissimus Dorsi' },
    { id: 5, name: 'Overhead Press', category: 'Shoulders', muscle: 'Deltoids' },
    { id: 6, name: 'Barbell Rows', category: 'Back', muscle: 'Rhomboids' },
    { id: 7, name: 'Dips', category: 'Chest', muscle: 'Triceps' },
    { id: 8, name: 'Lunges', category: 'Legs', muscle: 'Quadriceps' },
    { id: 9, name: 'Push-ups', category: 'Chest', muscle: 'Pectorals' },
    { id: 10, name: 'Planks', category: 'Core', muscle: 'Abdominals' }
  ];

  // Filter exercises based on search query
  const filteredExercises = exerciseLibrary.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    // Load previously selected exercises if any
    if (route.params?.selectedExercises) {
      setSelectedExercises(route.params.selectedExercises);
    }
  }, [route.params?.selectedExercises]);

  useEffect(() => {
    // Set up the header right button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleDone} style={{ marginRight: 4 }}>
          <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>
            Done ({selectedExercises.length})
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedExercises.length, theme.colors.primary, handleDone]);

  const toggleExerciseSelection = (exercise) => {
    const isSelected = selectedExercises.find(ex => ex.id === exercise.id);
    
    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(ex => ex.id !== exercise.id));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleDone = () => {
    if (selectedExercises.length === 0) {
      Alert.alert('No Exercises Selected', 'Please select at least one exercise.');
      return;
    }

    // Navigate back and pass selected exercises
    navigation.navigate('CreateIndividualWorkout', {
      selectedExercises: selectedExercises
    });
  };

  const isExerciseSelected = (exercise) => {
    return selectedExercises.find(ex => ex.id === exercise.id) !== undefined;
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {/* Search Bar */}
      <View className="p-4">
        <View className="flex-row items-center border rounded-xl p-3" style={{ 
          borderColor: theme.colors.border, 
          backgroundColor: theme.colors.backgroundTertiary 
        }}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textTertiary} />
          <TextInput
            className="flex-1 ml-2"
            style={{ color: theme.colors.text }}
            placeholder="Search exercises..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Exercise List */}
      <ScrollView className="flex-1 px-4">
        <View className="space-y-2 pb-6">
          {filteredExercises.map((exercise) => {
            const isSelected = isExerciseSelected(exercise);
            return (
              <TouchableOpacity
                key={exercise.id}
                className="border rounded-xl p-4 flex-row items-center justify-between"
                style={{
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: isSelected ? theme.colors.primaryLight : theme.colors.backgroundTertiary
                }}
                onPress={() => toggleExerciseSelection(exercise)}
              >
                <View className="flex-1">
                  <Text 
                    className="text-base font-semibold" 
                    style={{ color: theme.colors.text }}
                  >
                    {exercise.name}
                  </Text>
                  <Text 
                    className="text-sm mt-1" 
                    style={{ color: theme.colors.textTertiary }}
                  >
                    {exercise.category} • {exercise.muscle}
                  </Text>
                </View>
                
                <View className="ml-4">
                  {isSelected ? (
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                  ) : (
                    <MaterialCommunityIcons 
                      name="plus-circle-outline" 
                      size={24} 
                      color={theme.colors.textTertiary} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredExercises.length === 0 && (
          <View className="flex-1 items-center justify-center py-12">
            <MaterialCommunityIcons 
              name="dumbbell" 
              size={48} 
              color={theme.colors.textTertiary} 
            />
            <Text 
              className="text-base mt-4 text-center" 
              style={{ color: theme.colors.textTertiary }}
            >
              No exercises found matching "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      {selectedExercises.length > 0 && (
        <View 
          className="border-t p-4" 
          style={{ 
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.background 
          }}
        >
          <TouchableOpacity
            className="rounded-xl p-4 flex-row items-center justify-center"
            style={{ backgroundColor: theme.colors.primary }}
            onPress={handleDone}
          >
            <MaterialCommunityIcons name="check" size={20} color="white" />
            <Text className="text-white text-base font-semibold ml-2">
              Add {selectedExercises.length} Exercise{selectedExercises.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AddExercisesScreen;