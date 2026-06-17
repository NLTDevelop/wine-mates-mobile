import { AuthorizationStatus } from '@notifee/react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { featuresService } from '@/entities/features/FeaturesService';
import { locationModel } from '@/entities/location/LocationModel';
import { userService } from '@/entities/users/UserService';
import { getCurrentLocationPayload } from '@/libs/locations/getCurrentLocationPayload';
import { notificationService } from '@/libs/notificationService/NotificationService';
import * as RNLocalize from 'react-native-localize';

const syncLocation = async () => {
    try {
        if (locationModel.userLocation) {
            await userService.location({
                latitude: locationModel.userLocation.latitude,
                longitude: locationModel.userLocation.longitude,
                timezone: RNLocalize.getTimeZone(),
            });
            return;
        }

        if (!locationModel.hasPermission) {
            return;
        }

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

const syncPostAuthorizationSideEffects = () => {
    Promise.all([
        syncLocation(),
        registerNotifications(),
    ]).catch((error) => {
        console.warn('completeAuthorization -> side effects: ', error);
    });
};

export const completeAuthorization = async (navigation: NativeStackNavigationProp<any>) => {
    await Promise.all([
        userService.me(),
        featuresService.list(),
    ]);

    navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });

    syncPostAuthorizationSideEffects();
};
