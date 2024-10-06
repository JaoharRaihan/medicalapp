import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from "./components/AppNavigation";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFFxLnEbMqEg8zoIgcIscaw9BY-tV6_IA",
  authDomain: "afip-9f760.firebaseapp.com",
  projectId: "afip-9f760",
  storageBucket: "afip-9f760.appspot.com",
  messagingSenderId: "445855111309",
  appId: "1:445855111309:web:050a16e4d79c044348eac4",
  measurementId: "G-3CK5GM843B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication screen component
const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <Card style={styles.authContainer}>
      <Card.Content>
        <Title style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Title>
        <TextInput
          style={styles.input}
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
        />
        <Button
          mode="contained"
          onPress={handleAuthentication}
          style={styles.button}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
        <Paragraph style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

// Main App component
export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    try {
      if (user) {
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      }
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    }
  };

  return (
    <NavigationContainer>
      {user ? (
        <AppNavigation />
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <AuthScreen
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            handleAuthentication={handleAuthentication}
          />
        </ScrollView>
      )}
    </NavigationContainer>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginVertical: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 16,
  },
});
