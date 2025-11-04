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
        slider: {
            width: SLIDER_LENGTH,
            height: MARKER,
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
        labelsContainer: {
          marginTop: scaleVertical(5),
          width: SLIDER_LENGTH + MARKER,
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        trackBackground:{
          flexDirection: 'row',
          position: 'absolute',
          top:0,
          left: 0,
          width: SLIDER_LENGTH + MARKER,
          height: MARKER,
          borderRadius: TRACK_HEIGHT / 2,
          overflow: 'hidden',
        },
        leftSide: {
          flex: 1,
        },
        rightSide: {
          flex: 1,
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
