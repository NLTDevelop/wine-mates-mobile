import { links } from '@/Links';
import { useCallback, useState } from 'react';
import { loggerModel } from '../entity/loggerModel';

export const useLoggerModal = () => {
    const [isDevEnvironment, setIsDevEnvironment] = useState(links.isDevEnvironment);

    const onClose = useCallback(() => {
        loggerModel.isVisibleLogs = false;
    }, []);

    const onEnvironmentChange = useCallback(() => {
        links.toggleEnvironment();
        setIsDevEnvironment(links.isDevEnvironment);
    }, []);

    return { onEnvironmentChange, onClose, isDevEnvironment };
};
