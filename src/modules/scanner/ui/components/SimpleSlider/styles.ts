import { StyleSheet } from 'react-native';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors, MARKER: number, TRACK_HEIGHT: number) => {
    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: scaleVertical(6),
        },
        wrap: {
            width: scaleHorizontal(311),
            height: MARKER,
        },
        slider: {
            width: scaleHorizontal(311),
            height: MARKER,
            justifyContent: 'center',
        },
        selected: {
            backgroundColor: 'transparent',
        },
        track: {
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
            backgroundColor: 'transparent',
        },
        unselected: {
            backgroundColor: colors.unselectedSlider,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_HEIGHT / 2,
        },
        fill: {
            position: 'absolute',
            left: 0,
            top: (MARKER - TRACK_HEIGHT) / 2,
            height: TRACK_HEIGHT,
            backgroundColor: colors.primary,
            borderRadius: TRACK_HEIGHT / 2,
            overflow: 'hidden',
            zIndex: 0,
        },
        pattern: {
            position: 'absolute',
            width: 3000,
            height: TRACK_HEIGHT,
            opacity: 1,
        },
    });

    return styles;
};
