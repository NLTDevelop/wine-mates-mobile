import { useCallback, useState } from 'react';
import { userModel } from '@/entities/users/UserModel';
import { notificationService } from '@/libs/notificationService/NotificationService';

export const useLogoutAlert = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onShowLogoutAlert = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onHideLogoutAlert = useCallback(() => {
        if (!isLoading) {
            setIsVisible(false);
        }
    }, [isLoading]);

    const onLogout = useCallback(async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            await notificationService.unregisterCurrentDevice().catch(() => {});
            userModel.token = null;
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    return {
        isVisible,
        isLoading,
        onShowLogoutAlert,
        onHideLogoutAlert,
        onLogout,
    };
};
