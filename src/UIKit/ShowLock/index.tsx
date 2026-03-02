import { useMemo } from 'react';
import { View } from 'react-native';
import { LockIcon } from '@assets/icons/LockIcon';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    iconSize?: number;
}

export const ShowLock = ({ iconSize = 24 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <LockIcon width={iconSize} height={iconSize} />
        </View>
    );
};
