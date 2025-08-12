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
import { colors } from './lib/theme'; 
import { useTheme } from './hooks/useTheme';
const Tab = createBottomTabNavigator();
import { Linking } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import './global.css';

// Custom Navigation Themes using theme colors
const LightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.light.primary,
    background: colors.light.background,
    card: colors.light.surface,
    text: colors.light.text,
    border: colors.light.border,
    notification: colors.light.error,
  },
};

const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.dark.primary,
    background: colors.dark.background,
    card: colors.dark.surface,
    text: colors.dark.text,
    border: colors.dark.border,
    notification: colors.dark.error,
  },
};

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={{ 
        paddingBottom: insets.bottom, 
        height: 60 + insets.bottom,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        flexDirection: 'row'
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Dynamic colors based on theme
        const activeColor = theme.colors.primary;
        const inactiveColor = theme.colors.textSecondary;

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
            <Text 
              className="text-xs mt-1 font-medium"
              style={{ color: isFocused ? activeColor : inactiveColor }}
            >
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
  };
}

function ProfileModal({ onLogout }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [userInfo, setUserInfo] = useState(null);
  const theme = useTheme();

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
          backgroundColor: theme.colors.backgroundSecondary,
        },
        textStyle: {
          color: theme.colors.text,
        },
        titleTextStyle: {
          color: theme.colors.textSecondary,
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
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <ProfileModal onLogout={onLogout} />,
        headerStyle: { 
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { 
          color: theme.colors.text,
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: theme.colors.text,
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
        name="Workouts"
        component={WorkoutStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function MainApp({ onLogout }) {
  const theme = useTheme();

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
        options={getScreenOptions('Team Invitation', theme.isDark)}
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
  const theme = useTheme();

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
          barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
          backgroundColor={theme.colors.background} 
        />
        <View 
          className="flex-1 justify-center items-center" 
          style={{ backgroundColor: theme.colors.background }}
        >
          <View className="items-center">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mb-6 shadow-lg"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <MaterialCommunityIcons 
                name="dumbbell" 
                color="white" 
                size={36} 
              />
            </View>
            <Text 
              className="text-2xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              Checking session...
            </Text>
            <Text 
              className="text-base text-center px-8"
              style={{ color: theme.colors.textSecondary }}
            >
              Getting things ready for you
            </Text>
            
            {/* Loading indicator */}
            <View className="flex-row space-x-1 mt-6">
              <View 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: theme.colors.primary }}
              />
              <View 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: theme.colors.primary, animationDelay: '0.2s' }}
              />
              <View 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: theme.colors.primary, animationDelay: '0.4s' }}
              />
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
        barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      <ActionSheetProvider>
        <NavigationContainer  
          ref={navigationRef} 
          theme={theme.isDark ? DarkNavigationTheme : LightNavigationTheme}
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