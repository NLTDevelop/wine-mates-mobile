import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors, MARKER: number, TRACK_HEIGHT: number) =>
    StyleSheet.create({
        marker: {
            position: 'absolute',
            top: (TRACK_HEIGHT - MARKER) / 2,
            width: MARKER,
            height: MARKER,
            borderRadius: MARKER / 2,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border_strong,
        },
    });
