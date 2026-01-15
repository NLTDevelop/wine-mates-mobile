import { StyleSheet } from 'react-native';
import { scaleVertical } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors, MARKER: number, TRACK_HEIGHT: number, SLIDER_LENGTH: number) => {
    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: scaleVertical(24),
        },
        sliderWrapper: {
            width: SLIDER_LENGTH + MARKER,
            height: MARKER,
            position: 'relative',
            justifyContent: 'center',
        },
        slider: {
            width: SLIDER_LENGTH + MARKER,
            height: MARKER,
        },
        markerContainer: {
            position: 'absolute',
            top: 0,
            height: MARKER,
            justifyContent: 'center',
            pointerEvents: 'none',
        },
        labelsContainer: {
            marginTop: scaleVertical(5),
            width: SLIDER_LENGTH + MARKER,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        trackBackground: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: SLIDER_LENGTH + MARKER,
            height: MARKER,
            borderRadius: TRACK_HEIGHT / 2,
            overflow: 'hidden',
        },
        fillTrack: {
            position: 'absolute',
            left: 0,
            top: 0,
            height: MARKER,
            borderRadius: TRACK_HEIGHT / 2,
        },
        unselectedTrack: {
            position: 'absolute',
            left: 0,
            top: 0,
            width: SLIDER_LENGTH + MARKER,
            height: MARKER,
            backgroundColor: colors.unselectedSlider,
            borderRadius: TRACK_HEIGHT / 2,
            zIndex: -1,
        },
        label: {
            color: colors.text_light,
        },
        labelWrapper: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
        },
    });

    return styles;
};
