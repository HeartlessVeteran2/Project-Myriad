// React Native configuration for Android-only project
module.exports = {
  project: {
    android: {
      sourceDir: './android',
      appName: 'ProjectMyriad',
    },
  },
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        android: {
          sourceDir: './node_modules/react-native-vector-icons/android',
          packageImportPath: 'import io.github.reactnativecommunity.rnvectoricons.VectorIconsPackage;',
        },
      },
    },
    'react-native-sqlite-storage': {
      platforms: {
        android: {
          sourceDir: './node_modules/react-native-sqlite-storage/platforms/android',
          packageImportPath: 'import org.pgsqlite.SQLitePluginPackage;',
        },
      },
    },
    'react-native-reanimated': {
      platforms: {
        android: {
          sourceDir: './node_modules/react-native-reanimated/android',
        },
      },
    },
  },
};
