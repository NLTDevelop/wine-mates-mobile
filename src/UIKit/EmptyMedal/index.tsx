import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    size?: number;
}

export const EmptyMedal = ({ size = 54 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size), [colors, size]);

    return <View style={styles.container} />;
};
