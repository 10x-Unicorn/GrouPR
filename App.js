import React, { useState } from 'react';
import { StyleSheet, Text, View, useColorScheme, TouchableOpacity, Modal, Button, ActionSheetIOS } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import HomeScreen from './screens/HomeScreen.js';
import AboutScreen from './screens/AboutScreen.js';
import WorkoutStack from './components/WorkoutStack.js';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ActionSheetProvider> 
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="home"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="About"
            component={AboutScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="information"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="WorkoutStack"
            component={WorkoutStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="dumbbell"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}