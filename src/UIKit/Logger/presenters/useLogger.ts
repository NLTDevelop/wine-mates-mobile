import { useCallback } from 'react';
import { loggerModel } from '@/UIKit/Logger/entity/loggerModel';

export const useLogger = () => {
    const onOpen = useCallback(() => {
        loggerModel.isVisibleLogs = true;
    }, []);

    return { onOpen };
};
