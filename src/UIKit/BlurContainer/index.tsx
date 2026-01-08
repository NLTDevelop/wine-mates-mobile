import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import { LockIcon } from '@assets/icons/LockIcon';
import { isIOS } from '@/utils';

interface IProps {
    isLockIconCentered?: boolean;
}

export const BlurContainer = ({ isLockIconCentered = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <>
            <BlurView
                style={styles.blur}
                blurType={'light'}
                blurAmount={isIOS ? 7 : 10}
                reducedTransparencyFallbackColor={colors.background}
            />
            <View style={isLockIconCentered ? styles.centeredLockLayer : styles.lockLayer}>
                <LockIcon />
            </View>
        </>
    );
};
