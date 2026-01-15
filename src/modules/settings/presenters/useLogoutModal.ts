import { userModel } from '@/entities/users/UserModel';
import { useCallback, useState } from 'react';

export const useLogoutModal = () => {
    const [isVisible, setIsVisible] = useState(false);

    const onShowLogoutModal = useCallback(() => {
        setIsVisible(true);
    }, []);

    const onHideLogoutModal = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onLogout = useCallback(() => {
        userModel.token = null;
    }, []);

    return { isVisible, onShowLogoutModal, onHideLogoutModal, onLogout };
};
