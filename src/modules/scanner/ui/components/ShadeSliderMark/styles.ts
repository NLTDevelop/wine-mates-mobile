import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (  colors: IColors,  MARKER: number, MARKER_INNER: number, selectedColor: string,
    TRACK_HEIGHT: number,
) =>
    StyleSheet.create({
        marker: {
            position: 'absolute',
            top: (TRACK_HEIGHT - MARKER) / 2,
            width: MARKER,
            height: MARKER,
            borderRadius: MARKER / 2,
            backgroundColor: colors.background,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border_light,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
            elevation: 3,
        },
        markerInner: {
            width: MARKER_INNER,
            height: MARKER_INNER,
            borderRadius: MARKER_INNER / 2,
            backgroundColor: selectedColor,
        },
    });
