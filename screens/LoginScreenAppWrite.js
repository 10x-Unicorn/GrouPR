import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Switch } from 'react-native';
import { account } from '../lib/appwrite';
import { ID } from 'react-native-appwrite';


export default function LoginScreenAppWrite({ onLoginSuccess }) {
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
        <View style={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Appwrite Login'}</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            {isSignUp && (
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
            )}
            {isSignUp ? (
                <>
                    <Button title="Sign Up" onPress={handleSignUp} />
                    <Text style={{ textAlign: 'center', marginTop: 12 }}>
                        Already have an account?{' '}
                        <Text style={{ color: 'blue' }} onPress={() => setIsSignUp(false)}>
                            Log In
                        </Text>
                    </Text>
                </>
            ) : (
                <>
                    <Button title="Login" onPress={handleLogin} />
                    <Text style={{ textAlign: 'center', marginTop: 12 }}>
                        Don't have an account?{' '}
                        <Text style={{ color: 'blue' }} onPress={() => setIsSignUp(true)}>
                            Sign Up
                        </Text>
                    </Text>
                </>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 12, padding: 8, borderRadius: 4 },
    error: { color: 'red', marginTop: 12, textAlign: 'center' },
});