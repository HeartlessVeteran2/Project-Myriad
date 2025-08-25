import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
// Updated path for React Native 0.81+
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-tesseract-ocr
jest.mock('react-native-tesseract-ocr', () => ({
  recognize: jest.fn().mockResolvedValue('Mocked OCR Text'),
  LANG_ENGLISH: 'eng',
  LANG_JAPANESE: 'jpn',
  LANG_CHINESE_SIMPLIFIED: 'chi_sim',
}));
