import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { View, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './screens/HomeScreen.js';
import ChatScreen from './screens/ChatScreen.js';
import AboutScreen from './screens/AboutScreen.js';
import WorkoutStack from './components/WorkoutStack.js';
import LoginScreen from './screens/LoginScreen.js';
import ProfileButton from './components/ProfileButton.js';
import { account } from './lib/appwrite';
 
import './global.css';

const Tab = createBottomTabNavigator();

// Profile Modal Component with Safe Area
function ProfileModal({ onLogout }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [userInfo, setUserInfo] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const user = await account.get();
      setUserInfo(user);
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  };

  const showProfileOptions = () => {
    const options = ['View Profile', 'Settings', 'Sign Out', 'Cancel'];
    const destructiveButtonIndex = 2;
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: userInfo ? `Hello, ${userInfo.name || userInfo.email}` : 'Profile',
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // View Profile
            Alert.alert('Profile', `Name: ${userInfo?.name || 'Not set'}\nEmail: ${userInfo?.email}`);
            break;
          case 1:
            // Settings
            Alert.alert('Settings', 'Settings feature coming soon!');
            break;
          case 2:
            // Sign Out
            handleSignOut();
            break;
        }
      }
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: onLogout 
        }
      ]
    );
  };

  return (
    <View style={{ marginRight: Math.max(insets.right, 16) }}>
      <ProfileButton onPress={showProfileOptions} />
    </View>
  );
}

// Main App Component
function MainApp({ handleLogout }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          headerRight: () => <ProfileModal onLogout={handleLogout} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Chat"
        options={{
          headerRight: () => <ProfileModal onLogout={handleLogout} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      >
        {(props) => <ChatScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="About"
        options={{
          headerRight: () => <ProfileModal onLogout={handleLogout} />,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information" color={color} size={size} />
          ),
        }}
      >
        {(props) => <AboutScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="WorkoutStack"
        component={WorkoutStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to get current user session
      await account.get();
      setIsLoggedIn(true);
    } catch (error) {
      // No active session, user needs to login
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setIsLoggedIn(false);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
        <Text className="text-xl text-slate-800 dark:text-white">Loading...</Text>
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if authenticated
  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <MainApp handleLogout={handleLogout} />
      </NavigationContainer>
    </ActionSheetProvider>
  );
}