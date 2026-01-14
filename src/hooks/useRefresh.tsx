import { useState, useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { useUiContext } from '../UIProvider';

export const useRefresh = (onRefreshCallback?: () => Promise<void>) => {
    const { colors } = useUiContext();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await onRefreshCallback?.();
        setRefreshing(false);
    }, [onRefreshCallback]);

    const refreshControl = (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.background}
        />
    );

    return { refreshControl };
};
