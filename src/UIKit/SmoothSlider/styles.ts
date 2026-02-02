import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '@/utils';

const LABEL_WIDTH = scaleHorizontal(80);
const HALF_LABEL = LABEL_WIDTH / 4;
const TRACK_HEIGHT = scaleVertical(8);
const THUMB_SIZE = scaleHorizontal(48);
const HALF_THUMB = THUMB_SIZE / 2;

export const getStyles = (colors: IColors, sliderLength?: number, shouldStretch: boolean = false) => {
    const actualSliderLength = sliderLength ?? scaleHorizontal(343) - THUMB_SIZE;
    const hasSliderLength = sliderLength !== undefined && !shouldStretch;

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            justifyContent: 'center',
            alignItems: shouldStretch ? 'stretch' : 'center',
        },
        sliderWrapper: {
            paddingHorizontal: hasSliderLength || shouldStretch ? 0 : HALF_LABEL,
            width: hasSliderLength ? actualSliderLength : '100%',
        },
        trackContainer: {
            height: THUMB_SIZE,
            justifyContent: 'center',
            position: 'relative',
            width: hasSliderLength ? actualSliderLength : '100%',
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
        sectionContainer: {
            position: 'absolute',
            top: 0,
            width: '100%',
            height: TRACK_HEIGHT,
            justifyContent: 'center',
        },
        section: {
            position: 'absolute',
            width: scaleHorizontal(1),
            height: TRACK_HEIGHT,
            backgroundColor: colors.background,
            zIndex: 1,
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
        labelsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: scaleVertical(8),
            width: sliderLength ? actualSliderLength + THUMB_SIZE : '100%',
            paddingHorizontal: HALF_THUMB,
        },
        labelWrapper: {
            width: LABEL_WIDTH,
            alignItems: 'center',
        },
        middleLabelWrapper: {
            width: scaleHorizontal(100),
        },
        leftLabelWrapper: {
            alignItems: 'center',
            marginLeft: -LABEL_WIDTH / 2,
        },
        rightLabelWrapper: {
            alignItems: 'center',
            marginRight: -LABEL_WIDTH / 2,
        },
        labelText: {
            color: colors.text,
            textAlign: 'center',
        },
        leftLabelText: {
            textAlign: 'center',
            marginLeft: scaleHorizontal(8),
        },
        rightLabelText: {
            textAlign: 'center',
            marginRight: scaleHorizontal(8),
        },
    });
    return styles;
};
