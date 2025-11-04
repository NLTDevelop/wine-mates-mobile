import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors, MARKER: number, TRACK_HEIGHT: number, SLIDER_LENGTH: number) => {
    const styles = StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        slider: {
            width: SLIDER_LENGTH,
            height: TRACK_HEIGHT,
        },
        track: {
          height: TRACK_HEIGHT,
          borderTopLeftRadius: TRACK_HEIGHT / 2,
          borderBottomLeftRadius: TRACK_HEIGHT / 2,
        },
        unselected: {
          backgroundColor: colors.unselectedSlider,
          borderTopRightRadius: TRACK_HEIGHT / 2,
          borderBottomRightRadius: TRACK_HEIGHT / 2,
        },
        trackBackground:{
          flexDirection: 'row',
          position: 'absolute',
          top:0,
          left: 0,
          width: SLIDER_LENGTH + MARKER,
          height: TRACK_HEIGHT,
          borderRadius: 20,
          overflow: 'hidden',
        },
        leftSide: {
          flex: 1,
        },
        rightSide: {
          flex: 1,
        },
        sectionContainer: {
            position: 'absolute',
            top: 0,
            width: SLIDER_LENGTH,
            height: TRACK_HEIGHT,
            justifyContent: 'center',
        },
        section: {
            position: 'absolute',
            width: 1,
            height: TRACK_HEIGHT,
            backgroundColor: colors.background,
            zIndex: 1,
        },
    });

    return styles;
};
