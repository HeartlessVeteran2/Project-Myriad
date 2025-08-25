import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-tesseract-ocr
jest.mock('react-native-tesseract-ocr', () => ({
  recognize: jest.fn().mockResolvedValue('Mocked OCR Text'),
  LANG_ENGLISH: 'eng',
  LANG_JAPANESE: 'jpn',
  LANG_CHINESE_SIMPLIFIED: 'chi_sim',
}));
