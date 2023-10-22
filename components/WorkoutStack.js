import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutActionSheet from './WorkoutActionSheet.js';
import XBackButton from './XBackButton.js';
import WorkoutScreen from '../screens/WorkoutScreen.js';
import NewWorkoutScreen from '../screens/NewWorkoutScreen.js';
import ExercisesScreen from '../screens/ExercisesScreen.js';
import NewExercise from '../screens/NewExerciseScreen.js';

const Stack = createStackNavigator();
const WorkoutStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Workout" 
            component={WorkoutScreen} 
            options={{
            title: "Workouts",
            headerRight: ({ color }) => (
                <WorkoutActionSheet/>
            ),
            }}
            />
            <Stack.Screen name="NewWorkout" 
            component={NewWorkoutScreen}
            options={{
            title: "New Workout",
            }}
            />
            <Stack.Screen name="Exercises" 
            component={ExercisesScreen}
            options={{
            title: "Exercises",
            headerLeft: () => (
                <XBackButton/>
            ),
            }}
            />
        </Stack.Navigator>
        );
}

export default WorkoutStack;