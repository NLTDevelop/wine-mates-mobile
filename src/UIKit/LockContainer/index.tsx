import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { LockIcon } from '@assets/icons/LockIcon';

export const LockContainer = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <>
            <View pointerEvents="none" style={styles.baseLayer} />
            <View style={styles.centeredLockLayer}>
                <LockIcon />
            </View>
        </>
    );
};
