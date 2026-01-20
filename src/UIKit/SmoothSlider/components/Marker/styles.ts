import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

const DEFAULT_SIZE = scaleHorizontal(20);

export const getStyles = (colors: IColors, size?: number, color?: string) => {
    const markerSize = size ?? DEFAULT_SIZE;
    const markerColor = color ?? '#FFFFFF';

    const styles = StyleSheet.create({
        marker: {
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            backgroundColor: markerColor,
            borderWidth: 1,
            borderColor: '#000000',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    });

    return styles;
};
