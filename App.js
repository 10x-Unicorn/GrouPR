import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
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

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-slate-900 border-t border-slate-700"
      style={{ paddingBottom: insets.bottom, height: 60 + insets.bottom }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const icon = options.tabBarIcon?.({
          color: isFocused ? '#38bdf8' : '#94a3b8',
          size: 24,
        });

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            className="flex-1 items-center justify-center"
            onPress={onPress}
          >
            {icon}
            <Text className={`text-xs mt-1 ${isFocused ? 'text-sky-400' : 'text-slate-400'}`}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

cssInterop(CustomTabBar, { className: 'style' });

function ProfileModal({ onLogout }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [userInfo, setUserInfo] = useState(null);

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

  return <ProfileButton onPress={showOptions} />;
}

function MainApp({ onLogout }) {
  return (
      <Tab.Navigator
        screenOptions={{
          headerRight: () => (
            <View className="pr-3">
              <ProfileModal onLogout={onLogout} />
            </View>
          ),
          headerStyle: { backgroundColor: '#0f172a' },
          headerTitleStyle: { color: '#f1f5f9' },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="chat" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="information" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="dumbbell" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

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
      <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
        <Text className="text-xl text-slate-800 dark:text-white">Checking session...</Text>
      </View>
    );
  }

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <MainApp onLogout={handleLogout} />
        ) : (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
