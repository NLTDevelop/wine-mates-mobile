import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { useUiContext } from '../UIProvider';

export const useRefresh = (onRefreshCallback?: () => void) => {
    const { colors } = useUiContext();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await onRefreshCallback?.();
        setRefreshing(false);
    };

    const refreshControl = (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
        />
    );

    return { refreshControl, refreshing };
};
