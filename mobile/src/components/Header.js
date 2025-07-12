import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ user, onMenuClick, onThemeToggle, onLogin, onLogout, theme, apiStatus }) => {
  return (
    <View style={[styles.header, theme === 'dark' ? styles.headerDark : styles.headerLight]}>
      <Text style={[styles.logo, theme === 'dark' ? styles.logoDark : styles.logoLight]}>📚 Project Myriad</Text>
      <View style={styles.nav}>
        <View style={[styles.status, apiStatus === 'connected' ? styles.statusConnected : styles.statusDisconnected]}>
          <Text style={apiStatus === 'connected' ? styles.statusTextConnected : styles.statusTextDisconnected}>
            {apiStatus === 'connected' ? '🟢' : '🔴'} Backend: {apiStatus}
          </Text>
        </View>
        <TouchableOpacity onPress={onMenuClick} style={styles.button}>
          <Text style={theme === 'dark' ? styles.buttonDark : styles.buttonLight}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onThemeToggle} style={styles.button}>
          <Text style={theme === 'dark' ? styles.buttonDark : styles.buttonLight}>🌓</Text>
        </TouchableOpacity>
        {user ? (
          <TouchableOpacity onPress={onLogout} style={styles.button}>
            <Text style={theme === 'dark' ? styles.buttonDark : styles.buttonLight}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onLogin} style={styles.button}>
            <Text style={theme === 'dark' ? styles.buttonDark : styles.buttonLight}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    elevation: 2,
    zIndex: 100,
  },
  headerDark: {
    backgroundColor: '#1a1a2e',
    borderBottomColor: '#333',
  },
  headerLight: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoDark: {
    color: '#fff',
  },
  logoLight: {
    color: '#333',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 4,
  },
  buttonDark: {
    color: '#fff',
  },
  buttonLight: {
    color: '#333',
  },
  status: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
  },
  statusConnected: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  statusDisconnected: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  statusTextConnected: {
    color: '#155724',
    fontWeight: 'bold',
  },
  statusTextDisconnected: {
    color: '#721c24',
    fontWeight: 'bold',
  },
});

export default Header;
