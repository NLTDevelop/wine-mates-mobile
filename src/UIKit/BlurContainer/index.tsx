import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { LockIcon } from '@assets/icons/LockIcon';

interface IProps {
    isLockIconCentered?: boolean;
}

export const BlurContainer = ({ isLockIconCentered = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <>
            <View pointerEvents="none" style={styles.baseLayer} />
            <View style={isLockIconCentered ? styles.centeredLockLayer : styles.lockLayer}>
                <LockIcon />
            </View>
        </>
    );
};
