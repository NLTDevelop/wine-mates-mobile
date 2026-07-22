import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { LockIcon } from '@assets/icons/LockIcon';

interface IProps {
    iconSize?: number;
}

export const LockContainer = ({ iconSize = 32 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <>
            <View pointerEvents="none" style={styles.baseLayer} />
            <View pointerEvents="none" style={styles.centeredLockLayer}>
                <LockIcon width={iconSize} height={iconSize} />
            </View>
        </>
    );
};
