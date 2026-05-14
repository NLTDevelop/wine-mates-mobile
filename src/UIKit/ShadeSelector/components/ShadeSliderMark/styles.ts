import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, MARKER: number, MARKER_INNER: number, TRACK_HEIGHT: number) => {
    const styles = StyleSheet.create({
        marker: {
            position: 'absolute',
            top: (TRACK_HEIGHT - MARKER) / 2,
            width: scaleVertical(MARKER / scaleVertical(1)),
            height: scaleVertical(MARKER / scaleVertical(1)),
            borderRadius: MARKER / 2,
            backgroundColor: colors.background,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border_light,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: scaleVertical(1) },
            shadowRadius: 2,
            elevation: 3,
        },
        markerInner: {
            width: scaleVertical(MARKER_INNER / scaleVertical(1)),
            height: scaleVertical(MARKER_INNER / scaleVertical(1)),
            borderRadius: MARKER_INNER / 2,
        },
    });

    return styles;
};
