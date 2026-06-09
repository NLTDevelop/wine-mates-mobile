import { AuthorizationStatus } from '@notifee/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { featuresService } from '@/entities/features/FeaturesService';
import { userService } from '@/entities/users/UserService';
import { getCurrentLocationPayload } from '@/libs/locations/getCurrentLocationPayload';
import { notificationService } from '@/libs/notificationService/NotificationService';

const syncLocation = async () => {
    try {
        const locationPayload = await getCurrentLocationPayload();
        if (locationPayload) {
            await userService.location(locationPayload);
        }
    } catch (error) {
        console.warn('completeAuthorization -> location: ', error);
    }
};

const registerNotifications = async () => {
    try {
        const notificationStatus = await notificationService.requestPermissions();
        await notificationService.createChannels();
        if (notificationStatus !== AuthorizationStatus.DENIED) {
            await notificationService.register();
        }
    } catch (error) {
        console.warn('completeAuthorization -> notifications: ', error);
    }
};

export const completeAuthorization = async (navigation: NativeStackNavigationProp<any>) => {
    await Promise.all([
        userService.me(),
        syncLocation(),
        registerNotifications(),
        featuresService.list(),
    ]);

    navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
};
