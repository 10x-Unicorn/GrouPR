import React, { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutScreen from '../screens/WorkoutScreen';
import CreateIndividualWorkoutScreen from '../screens/CreateIndividualWorkoutScreen';
import CreateWorkoutPlanScreen from '../screens/CreateWorkoutPlanScreen';
import AddExercisesScreen from '../screens/AddExercisesScreen';
import { colors } from '../lib/theme';

const Stack = createNativeStackNavigator();

// Helper function to generate consistent screen options
function getScreenOptions(title, isDark) {
  const theme = isDark ? colors.dark : colors.light;
  
  return {
    title,
    headerStyle: { 
      backgroundColor: theme.background,
    },
    headerTitleStyle: { 
      color: theme.text,
    },
    headerTintColor: theme.text,
    headerBackTitle: '',
    headerBackTitleVisible: false,
  };
}

export default function WorkoutStack() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="WorkoutsScreen"
        component={WorkoutScreen} 
        options={getScreenOptions('Workouts', isDark)}
      />
      <Stack.Screen 
        name="CreateIndividualWorkout" 
        component={CreateIndividualWorkoutScreen}
        options={getScreenOptions('Create Individual Workout', isDark)}
      />
      <Stack.Screen 
        name="CreateWorkoutPlan" 
        component={CreateWorkoutPlanScreen}
        options={getScreenOptions('Create Workout Plan', isDark)}
      />
      <Stack.Screen 
        name="AddExercisesScreen" 
        component={AddExercisesScreen}
        options={getScreenOptions('Add Exercises', isDark)}
      />
    </Stack.Navigator>
  );
}