import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

const TOUCH_AREA = scaleHorizontal(60);

export const getStyles = (colors: IColors, MARKER: number, TRACK_HEIGHT: number) =>
    StyleSheet.create({
        touchArea: {
            width: TOUCH_AREA,
            height: TOUCH_AREA,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: (TRACK_HEIGHT - TOUCH_AREA) / 2,
        },
        marker: {
            width: MARKER,
            height: MARKER,
            borderRadius: MARKER / 2,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border_strong,
        },
    });
