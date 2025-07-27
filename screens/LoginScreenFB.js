import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Switch } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Emulator config (adjust port if needed)
const emulatorConfig = {
    apiKey: "fake-api-key",
    authDomain: "localhost",
    projectId: "demo-project",
    appId: "demo-app-id",
};

// Prod config (leaving empty for now, on purpose so we don't accidentally use prod keys)
const prodConfig = {
    apiKey: "YOUR_PROD_API_KEY",
    authDomain: "YOUR_PROD_AUTH_DOMAIN",
    projectId: "YOUR_PROD_PROJECT_ID",
    appId: "YOUR_PROD_APP_ID",
};

let firebaseApp;

function initializeFirebase(useProd) {
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(useProd ? prodConfig : emulatorConfig);
        if (!useProd) {
            const emulatorHost = Platform.OS === 'android' ? '10.0.2.2' : Constants.expoConfig.extra.ipAddress ;
            firebase.auth().useEmulator(`http://${emulatorHost}:9099/`);
        }
    }
}

export default function LoginScreen({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [useProd, setUseProd] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);

    React.useEffect(() => {
        initializeFirebase(useProd);
        // eslint-disable-next-line
    }, [useProd]);

    const handleLogin = async () => {
        setError('');
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            if (typeof onLoginSuccess === 'function') onLoginSuccess();
        } catch (e) {
            setError(e.message);
        }
    };

    const handleSignUp = async () => {
        setError('');
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, password);
            if (typeof onLoginSuccess === 'function') onLoginSuccess();
        } catch (e) {
            setError(e.message);
            console.error("Sign Up Error:", e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Firebase Login'}</Text>
            {/* <View style={styles.switchRow}>
                <Text>Use Production Config</Text>
                <Switch value={useProd} onValueChange={setUseProd} />
            </View> */}
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
    switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' },
});