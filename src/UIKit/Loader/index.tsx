import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { ActivityIndicator, View } from 'react-native';

export const Loader = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container} >
            <ActivityIndicator color={colors.primary} size="large" />
        </View>
    );
};
