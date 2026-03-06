import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

const DEFAULT_SIZE = scaleHorizontal(20);

export const getStyles = (colors: IColors, size?: number, color?: string) => {
    const markerSize = size ?? DEFAULT_SIZE;
    const markerColor = color ?? colors.background;

    const styles = StyleSheet.create({
        marker: {
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            backgroundColor: markerColor,
            borderWidth: 1,
            borderColor: colors.background_inverted,
        },
    });

    return styles;
};
