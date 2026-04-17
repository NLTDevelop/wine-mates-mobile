import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

export const getStyles = (colors: IColors, size: number) =>
    StyleSheet.create({
        container: {
            width: scaleHorizontal(size),
            height: scaleHorizontal(size),
            borderRadius: scaleHorizontal(size / 2),
            borderWidth: 2,
            borderColor: colors.border_light,
        },
    });
