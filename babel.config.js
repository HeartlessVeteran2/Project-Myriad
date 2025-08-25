module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    // Only include reanimated plugin for non-test environments
    // Default NODE_ENV to 'development' if not set
    ...((env => env === 'test' ? [] : ['react-native-reanimated/plugin'])(
      process.env.NODE_ENV || 'development'
    )),
  ],
};

