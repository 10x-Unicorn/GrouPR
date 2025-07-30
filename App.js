import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, useColorScheme, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { cssInterop } from 'nativewind';

import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import AboutScreen from './screens/AboutScreen';
import WorkoutStack from './components/WorkoutStack';
import LoginScreen from './screens/LoginScreen';
import ProfileButton from './components/ProfileButton';
import { account } from './lib/appwrite';

import './global.css';

const Tab = createBottomTabNavigator();

// Custom Navigation Themes using NativeWind colors
const LightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3b82f6', // blue-500
    background: '#ffffff', // white
    card: '#ffffff', // white
    text: '#1e293b', // slate-800
    border: '#e2e8f0', // slate-200
    notification: '#ef4444', // red-500
  },
};

const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#38bdf8', // sky-400
    background: '#0f172a', // slate-900
    card: '#1e293b', // slate-800
    text: '#f1f5f9', // slate-100
    border: '#334155', // slate-700
    notification: '#ef4444', // red-500
  },
};

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
      style={{ paddingBottom: insets.bottom, height: 60 + insets.bottom }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const icon = options.tabBarIcon?.({
          color: isFocused ? '#3b82f6' : '#64748b', // We'll handle dark mode colors with CSS
          size: 24,
        });

        const onPress = () => {
          const event = navigation.emit({ 
            type: 'tabPress', 
            target: route.key, 
            canPreventDefault: true 
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            className={`flex-1 items-center justify-center py-2 ${
              isFocused 
                ? 'bg-blue-50 dark:bg-slate-800' 
                : 'bg-transparent'
            }`}
            onPress={onPress}
          >
            <View className={`p-1 rounded-lg ${
              isFocused 
                ? 'bg-blue-100 dark:bg-sky-900/50' 
                : 'bg-transparent'
            }`}>
              {icon}
            </View>
            <Text className={`text-xs mt-1 font-medium ${
              isFocused 
                ? 'text-blue-600 dark:text-sky-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Apply NativeWind to custom components
cssInterop(CustomTabBar, { className: 'style' });

function ProfileModal({ onLogout }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [userInfo, setUserInfo] = useState(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    account.get().then(setUserInfo).catch(console.error);
  }, []);

  const showOptions = () => {
    const options = ['View Profile', 'Sign Out', 'Cancel'];
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
        title: userInfo?.name ?? 'Profile',
        // Style the action sheet based on theme
        containerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
        },
        textStyle: {
          color: colorScheme === 'dark' ? '#f1f5f9' : '#1e293b',
        },
        titleTextStyle: {
          color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b',
        },
      },
      (index) => {
        if (index === 0) {
          Alert.alert('Profile', `Email: ${userInfo?.email}`);
        } else if (index === 1) {
          onLogout();
        }
      }
    );
  };

  return (
    <View className="mr-4">
      <ProfileButton onPress={showOptions} />
    </View>
  );
}

function MainApp({ onLogout }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <ProfileModal onLogout={onLogout} />,
        // Use NativeWind colors but apply them through JS since React Navigation doesn't support className
        headerStyle: { 
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#334155' : '#e2e8f0',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { 
          color: isDark ? '#f1f5f9' : '#1e293b',
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: isDark ? '#f1f5f9' : '#1e293b',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
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
  const [checking, setChecking] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    account
      .get()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setChecking(false));
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = async () => {
    await account.deleteSession('current');
    setIsLoggedIn(false);
  };

  if (checking) {
    return (
      <>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={isDark ? '#0f172a' : '#ffffff'} 
        />
        <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
          <View className="items-center">
            <View className="w-20 h-20 bg-blue-500 dark:bg-sky-400 rounded-full items-center justify-center mb-6 shadow-lg">
              <MaterialCommunityIcons 
                name="dumbbell" 
                color="white" 
                size={36} 
              />
            </View>
            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Checking session...
            </Text>
            <Text className="text-base text-slate-500 dark:text-slate-400 text-center px-8">
              Getting things ready for you
            </Text>
            
            {/* Loading indicator */}
            <View className="flex-row space-x-1 mt-6">
              <View className="w-2 h-2 bg-blue-500 dark:bg-sky-400 rounded-full animate-pulse" />
              <View className="w-2 h-2 bg-blue-500 dark:bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <View className="w-2 h-2 bg-blue-500 dark:bg-sky-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? '#0f172a' : '#ffffff'} 
      />
      <ActionSheetProvider>
        <NavigationContainer theme={isDark ? DarkNavigationTheme : LightNavigationTheme}>
          {isLoggedIn ? (
            <MainApp onLogout={handleLogout} />
          ) : (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          )}
        </NavigationContainer>
      </ActionSheetProvider>
    </>
  );
}