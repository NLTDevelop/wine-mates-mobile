import { useEffect } from 'react';
import { notificationService } from './NotificationService';

export const useNotifications = () => {
    useEffect(() => {
        notificationService.createChannels();
        notificationService.startForegroundSubscription();
        notificationService.startNotificationPressSubscription();

        return () => {
            notificationService.stopForegroundSubscription();
            notificationService.stopNotificationPressSubscription();
        };
    }, []);
};
