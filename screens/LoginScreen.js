import React, { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { account } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';

export default function LoginScreen({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignUp, setIsSignUp] = useState(true);
    const [name, setName] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            await account.createEmailPasswordSession(email, password);
            if (typeof onLoginSuccess === 'function') onLoginSuccess();
        } catch (e) {
            setError(e.message || 'Login failed');
        }
    };

    const handleSignUp = async () => {
        setError('');
        try {
            await account.create(ID.unique(), email, password, name);
            await handleLogin();
            if (typeof onLoginSuccess === 'function') onLoginSuccess();
        } catch (e) {
            setError(e.message || 'Registration failed');
        }
    };

    return (
        <View className="flex-1 justify-center px-6 bg-white dark:bg-slate-900">
            <Text className="text-3xl font-bold mb-8 text-center text-slate-800 dark:text-white">
                {isSignUp ? 'Sign Up' : 'Appwrite Login'}
            </Text>
            
            <TextInput
                className="border border-slate-300 dark:border-slate-600 mb-4 p-4 rounded-lg text-base bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Email"
                placeholderTextColor="#64748b"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            
            <TextInput
                className="border border-slate-300 dark:border-slate-600 mb-4 p-4 rounded-lg text-base bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Password"
                placeholderTextColor="#64748b"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            
            {isSignUp && (
                <TextInput
                    className="border border-slate-300 dark:border-slate-600 mb-6 p-4 rounded-lg text-base bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Name"
                    placeholderTextColor="#64748b"
                    value={name}
                    onChangeText={setName}
                />
            )}
            
            {isSignUp ? (
                <>
                    <Pressable 
                        className="bg-blue-600 dark:bg-blue-500 py-4 rounded-lg mb-4 active:opacity-80"
                        onPress={handleSignUp}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Sign Up
                        </Text>
                    </Pressable>
                    
                    <Text className="text-center text-slate-600 dark:text-slate-300 mt-4">
                        Already have an account?{' '}
                        <Text 
                            className="text-blue-600 dark:text-blue-400 font-medium" 
                            onPress={() => setIsSignUp(false)}
                        >
                            Log In
                        </Text>
                    </Text>
                </>
            ) : (
                <>
                    <Pressable 
                        className="bg-blue-600 dark:bg-blue-500 py-4 rounded-lg mb-4 active:opacity-80"
                        onPress={handleLogin}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Login
                        </Text>
                    </Pressable>
                    
                    <Text className="text-center text-slate-600 dark:text-slate-300 mt-4">
                        Don't have an account?{' '}
                        <Text 
                            className="text-blue-600 dark:text-blue-400 font-medium" 
                            onPress={() => setIsSignUp(true)}
                        >
                            Sign Up
                        </Text>
                    </Text>
                </>
            )}
            
            {error ? (
                <Text className="text-red-500 dark:text-red-400 mt-4 text-center text-base">
                    {error}
                </Text>
            ) : null}
        </View>
    );
}