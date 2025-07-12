import { AppRegistry } from 'react-native';
import App from './App';

// Register the app for web
AppRegistry.registerComponent('ProjectMyriad', () => App);

// Run the app on web
AppRegistry.runApplication('ProjectMyriad', {
  initialProps: {},
  rootTag: document.getElementById('root')
});
