import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../shared/api';
import { clearToken, getToken, saveToken } from '../shared/auth';
import { defaultTheme } from '../shared/theme';
import { ErrorBoundary, Header } from './src/components';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createStackNavigator();

export default function App() {
  const [theme, setTheme] = useState(defaultTheme);
  const [user, setUser] = useState(null);
  const [apiStatus, setApiStatus] = useState('disconnected');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check for saved user session and theme
    const loadUserData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const savedTheme = await AsyncStorage.getItem('theme');
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
          const token = getToken();
          if (token) setAuthToken(token);
        }
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleLogin = async (userData) => {
    setUser(userData);
    saveToken(userData.token);
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
    setAuthToken(userData.token);
  };

  const handleLogout = async () => {
    setUser(null);
    clearToken();
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user data:', error);
    }
    setAuthToken(null);
  };

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ErrorBoundary>
      <View style={[styles.container, theme === 'dark' ? styles.containerDark : styles.containerLight]}>
        <Header 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onThemeToggle={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
          onLogin={() => {/* Navigate to login */}}
          onLogout={handleLogout}
          theme={theme}
          apiStatus={apiStatus}
        />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#1a1a2e',
  },
  containerLight: {
    backgroundColor: '#ffffff',
  },
});
