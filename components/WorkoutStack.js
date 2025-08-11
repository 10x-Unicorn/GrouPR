import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutTabsScreen from '../screens/WorkoutTabsScreen';
import CreateWorkoutPlanScreen from '../screens/CreateWorkoutPlanScreen';

const Stack = createNativeStackNavigator();

const WorkoutStack = () => {
    return (
            <Stack.Navigator>
                <Stack.Screen name="Workout" 
                component={WorkoutTabsScreen} 
                options={{
                title: "Workouts",
                }}
                />
                <Stack.Screen name="CreateWorkoutPlan" 
                component={CreateWorkoutPlanScreen} 
                options={{
                title: "Create Workout Plan",
                }}
                />
            </Stack.Navigator>
        );
}

export default WorkoutStack;