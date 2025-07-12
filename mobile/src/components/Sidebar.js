import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const Sidebar = ({ isOpen, onClose, theme, user }) => {
  if (!isOpen) return null;
  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
      <View style={[styles.sidebar, theme === 'dark' ? styles.sidebarDark : styles.sidebarLight]}>
        <View style={styles.header}>
          <Text style={[styles.title, theme === 'dark' ? styles.titleDark : styles.titleLight]}>Menu</Text>
        </View>
        <View style={styles.nav}>
          {/* Add navigation items here */}
          <Text style={styles.navItem}>Home</Text>
          <Text style={styles.navItem}>Library</Text>
          <Text style={styles.navItem}>Settings</Text>
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    width: 300,
    height: '100%',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    elevation: 4,
    zIndex: 1000,
  },
  sidebarDark: {
    backgroundColor: '#1a1a2e',
    borderRightColor: '#333',
  },
  sidebarLight: {
    backgroundColor: '#fff',
    borderRightColor: '#eee',
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleDark: {
    color: '#fff',
    borderBottomColor: '#333',
  },
  titleLight: {
    color: '#333',
    borderBottomColor: '#eee',
  },
  nav: {
    marginTop: 16,
  },
  navItem: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
});

export default Sidebar;
