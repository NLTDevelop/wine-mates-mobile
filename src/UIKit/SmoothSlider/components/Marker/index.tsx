import { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';

interface IProps {
    size?: number;
    color?: string;
    style?: ViewStyle;
}

export const Marker = ({ size, color, style }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size, color), [colors, size, color]);

    return (
        <View style={[styles.marker, style]} />
    );
};
