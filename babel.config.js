module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Only include reanimated plugin for non-test environments
    ...(process.env.NODE_ENV !== 'test' ? ['react-native-reanimated/plugin'] : []),
  ],
};

