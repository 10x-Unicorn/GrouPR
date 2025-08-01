import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, useColorScheme, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { cssInterop } from 'nativewind';
import { navigationRef } from './navigation/navigationRef';

import AcceptInviteScreen from './screens/AcceptInviteScreen';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import WorkoutStack from './components/WorkoutStack';
import LoginScreen from './screens/LoginScreen';
import ProfileButton from './components/ProfileButton';
import { account } from './lib/appwrite';
import GroupsStack from './components/GroupsStack'; 
const Tab = createBottomTabNavigator();
import { Linking } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import './global.css';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={`flex-row border-t ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
      style={{ paddingBottom: insets.bottom, height: 60 + insets.bottom }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Dynamic colors based on dark mode
        const activeColor = isDark ? '#38bdf8' : '#3b82f6'; // sky-400 or blue-600
        const inactiveColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 or slate-500
        const labelActive = isDark ? 'text-sky-400' : 'text-blue-600';
        const labelInactive = isDark ? 'text-slate-400' : 'text-slate-500';

        const icon = options.tabBarIcon?.({
          color: isFocused ? activeColor : inactiveColor,
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
            className="flex-1 items-center justify-center py-2"
            onPress={onPress}
          >
            <View className="p-1">
              {icon}
            </View>
            <Text className={`text-xs mt-1 font-medium ${isFocused ? labelActive : labelInactive}`}>
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

function MainTabNavigator({ onLogout }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <ProfileModal onLogout={onLogout} />,
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
        name="Groups"
        component={GroupsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
          headerShown: false,
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

function MainApp({ onLogout }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        options={{ headerShown: false }}
      >
        {(props) => <MainTabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen 
        name="AcceptInvite" 
        component={AcceptInviteScreen}
        options={{
          title: 'Team Invitation',
          headerStyle: { 
            backgroundColor: isDark ? '#0f172a' : '#ffffff',
          },
          headerTitleStyle: { 
            color: isDark ? '#f1f5f9' : '#1e293b',
          },
          headerTintColor: isDark ? '#f1f5f9' : '#1e293b',
        }}
      />
    </Stack.Navigator>
  );
}

// Helper function to parse URL parameters
function parseInviteUrl(url) {
  try {
    const urlObj = new URL(url);
    const params = {};
    
    // Extract query parameters
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    return params;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pendingInvite, setPendingInvite] = useState(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Handle deep linking
  const handleDeepLink = (url) => {
    console.log('Handling deep link:', url);
    
    if (url && url.includes('/accept-invite')) {
      const inviteParams = parseInviteUrl(url);
      
      if (inviteParams && navigationRef.isReady()) {
        // If user is logged in, navigate immediately
        if (isLoggedIn) {
          navigationRef.navigate('AcceptInvite', inviteParams);
        } else {
          // Store invite to handle after login
          setPendingInvite(inviteParams);
        }
      }
    }
  };

  useEffect(() => {
    // Check authentication status
    account
      .get()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setChecking(false));

    // Listen for incoming links when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Handle link that opened the app (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => subscription?.remove();
  }, []);

  // Handle pending invite after login
  useEffect(() => {
    if (isLoggedIn && pendingInvite && navigationRef.isReady()) {
      // Small delay to ensure navigation is fully ready
      setTimeout(() => {
        navigationRef.navigate('AcceptInvite', pendingInvite);
        setPendingInvite(null);
      }, 100);
    }
  }, [isLoggedIn, pendingInvite]);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  
  const handleLogout = async () => {
    await account.deleteSession('current');
    setIsLoggedIn(false);
    setPendingInvite(null); // Clear any pending invites
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

  // Configure linking for React Navigation
  const linking = {
    prefixes: ['http://192.168.1.167:8081', 'https://yourapp.com'], // Add your actual domain
    config: {
      screens: {
        MainTabs: {
          screens: {
            Home: 'home',
            Groups: 'groups',
            About: 'about',
            Workout: 'workout',
          },
        },
        AcceptInvite: 'accept-invite',
      },
    },
  };

  return (
    <>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={isDark ? '#0f172a' : '#ffffff'} 
      />
      <ActionSheetProvider>
        <NavigationContainer  
          ref={navigationRef} 
          theme={isDark ? DarkNavigationTheme : LightNavigationTheme}
          linking={linking}
        >
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