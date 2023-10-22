// NewWorkoutScreen.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import ExercisesScreen from './ExercisesScreen.js';
import { useNavigation } from '@react-navigation/native';

const NewWorkoutScreen = () => {
  const navigation = useNavigation();
  const [workoutTitle, setWorkoutTitle] = useState('Untitled Workout 1');


  const handleAddExercise = () => {
    console.log('Adding exercise');
    navigation.navigate('Exercises');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(newText) => setWorkoutTitle(newText)}
        placeholder={workoutTitle}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleAddExercise}
      >
        <Text style={styles.buttonText}>Add Exercises to Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderWidth: 0, // Remove the border
    fontSize: 24,
    
  },
  button: {
    width: '80%', // Set a specific width
    height: 40, // Set a specific height
    backgroundColor: 'black', // Background color for the button
    borderRadius: 50, // Use a large border radius to make it oval
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default NewWorkoutScreen;
