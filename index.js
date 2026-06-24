import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import { notificationService } from './src/libs/notificationService/NotificationService';

notificationService.subscribeBackground();

AppRegistry.registerComponent(appName, () => App);