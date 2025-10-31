import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ActivityIndicator } from 'react-native';

export const ListFooterLoader = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return <ActivityIndicator style={styles.listLoader} color={colors.primary} size="large" />;
};
