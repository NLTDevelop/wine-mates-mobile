import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '@/utils';

const TRACK_HEIGHT = scaleVertical(8);
const THUMB_SIZE = scaleHorizontal(48);
const HALF_THUMB = THUMB_SIZE / 2;

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        sliderWrapper: {
            width: '100%',
        },
        trackContainer: {
            height: THUMB_SIZE,
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
        },
        track: {
            height: TRACK_HEIGHT,
            backgroundColor: colors.unselectedSlider,
            borderRadius: TRACK_HEIGHT / 2,
            width: '100%',
        },
        activeTrack: {
            height: TRACK_HEIGHT,
            backgroundColor: colors.primary,
            borderRadius: TRACK_HEIGHT / 2,
            position: 'absolute',
            left: 0,
        },
        thumbWrapper: {
            position: 'absolute',
            left: -HALF_THUMB,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
        },
        thumb: {
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: THUMB_SIZE / 2,
            backgroundColor: colors.primary,
            shadowColor: colors.text,
            shadowOffset: {
                width: 0,
                height: scaleVertical(2),
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        decoratorContainer: {
            position: 'absolute',
            alignSelf: 'center',
            left: 0,
            width: '100%',
            height: TRACK_HEIGHT,
            justifyContent: 'center',
            zIndex: 2,
        },
        decoratorItem: {
            position: 'absolute',
            height: TRACK_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    return styles;
};
