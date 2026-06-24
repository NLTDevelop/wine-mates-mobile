import { userModel } from '@/entities/users/UserModel';
import { notificationService } from '@/libs/notificationService/NotificationService';
import { useCallback, useState } from 'react';

export const useLogoutModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    const onShowLogoutModal = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onHideLogoutModal = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onLogout = useCallback(async () => {
        await notificationService.unregisterCurrentDevice().catch(() => {});
        userModel.token = null;
    }, []);

    return { isVisible, onShowLogoutModal, onHideLogoutModal, onLogout };
};
