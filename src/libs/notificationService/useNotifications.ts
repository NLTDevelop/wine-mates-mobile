import { useEffect } from 'react';
import { AuthorizationStatus } from '@notifee/react-native';
import { notificationService } from './NotificationService';

export const useNotifications = () => {
    useEffect(() => {
        notificationService.requestPermissions().then(status => {
            notificationService.createChannels();

            if (status !== AuthorizationStatus.DENIED) {
                notificationService.register();
            }
        });

        notificationService.startForegroundSubscription();

        return () => {
            notificationService.stopForegroundSubscription();
        };
    }, []);
};
