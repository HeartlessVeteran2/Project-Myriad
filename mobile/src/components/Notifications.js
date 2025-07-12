import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationBadge = ({ count, theme, size = 'small', variant = 'primary' }) => {
  if (!count || count === 0) return null;

  const sizeStyles = {
    small: { minWidth: 18, height: 18, fontSize: 12, paddingHorizontal: 4 },
    medium: { minWidth: 22, height: 22, fontSize: 14, paddingHorizontal: 6 },
    large: { minWidth: 26, height: 26, fontSize: 16, paddingHorizontal: 8 },
  };

  const variantStyles = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    success: { backgroundColor: '#28a745', color: 'white' },
    warning: { backgroundColor: '#ffc107', color: '#212529' },
    danger: { backgroundColor: '#dc3545', color: 'white' },
  };

  const badgeStyle = [
    styles.badge,
    sizeStyles[size],
    { backgroundColor: variantStyles[variant].backgroundColor },
  ];
  const textStyle = [
    styles.text,
    { color: variantStyles[variant].color, fontSize: sizeStyles[size].fontSize },
  ];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 4,
    marginRight: 4,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationBadge;
