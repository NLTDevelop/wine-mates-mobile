import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';

interface IProps {
    size: number;
    trackHeight: number;
}

export const Marker = ({ size, trackHeight }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size, trackHeight), [colors, size, trackHeight]);

    return <View style={styles.marker} />;
};
