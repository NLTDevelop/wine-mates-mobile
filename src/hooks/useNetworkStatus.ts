import { useEffect, useCallback } from 'react';
import { addEventListener, fetch } from '@react-native-community/netinfo';
import { appStateModel } from '@/entities/appState/AppStateModel';
import { useDebounce } from '@/hooks/useDebounce';

export const useNetworkStatus = () => {
    const { debouncedWrapper } = useDebounce((isConnected: boolean) => {
        appStateModel.network = isConnected;
    }, 1000);

    useEffect(() => {
        const unsubscribe = addEventListener(state => {
            debouncedWrapper(!!state.isConnected);
        });

        return unsubscribe;
    }, [debouncedWrapper]);

    const handleRetry = useCallback(() => {
        fetch().then(state => {
            appStateModel.network = !!state.isConnected;
        });
    }, []);

    return { handleRetry };
};
