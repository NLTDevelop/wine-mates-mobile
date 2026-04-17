import { links } from '@/Links';
import { useCallback, useState } from 'react';
import { loggerModel } from '../entity/loggerModel';
import { userModel } from '@/entities/users/UserModel';

export const useLoggerModal = () => {
    const [isDevEnvironment, setIsDevEnvironment] = useState(links.isDevEnvironment);
    const [isPremiumEnabled, setIsPremiumEnabled] = useState(userModel.user?.hasPremium || false);

    const onClose = useCallback(() => {
        loggerModel.isVisibleLogs = false;
    }, []);

    const onEnvironmentChange = useCallback(() => {
        links.toggleEnvironment();
        setIsDevEnvironment(links.isDevEnvironment);
    }, []);

    const onTogglePremium = useCallback(() => {
        if (userModel.user) {
            userModel.user.hasPremium = !userModel.user.hasPremium;
            setIsPremiumEnabled(userModel.user.hasPremium);
        }
    }, []);

    return { onEnvironmentChange, onClose, isDevEnvironment, onTogglePremium, isPremiumEnabled };
};
