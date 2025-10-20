import { userModel } from '@/entities/users/UserModel';
import { useCallback } from 'react';

export const usePersonalProfile = () => {

    const handleLogout = useCallback(() => {
        userModel.token = null;
    }, []);

    return { handleLogout };
};
