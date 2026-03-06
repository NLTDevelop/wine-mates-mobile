import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal, scaleFontSize } from '@/utils';

const LABEL_WIDTH = scaleHorizontal(90);
const HALF_LABEL = LABEL_WIDTH / 4;
const TRACK_HEIGHT = scaleVertical(8);
const THUMB_SIZE = scaleHorizontal(24);
const HALF_THUMB = THUMB_SIZE / 2;

export const getStyles = (colors: IColors, sliderLength?: number, shouldStretch: boolean = false, edgeAlignedLabels: boolean = false) => {
    const actualSliderLength = sliderLength ?? scaleHorizontal(343) - THUMB_SIZE;
    const hasSliderLength = sliderLength !== undefined && !shouldStretch;

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            justifyContent: 'center',
            alignItems: shouldStretch ? 'stretch' : 'center',
        },
        sliderWrapper: {
            paddingHorizontal: hasSliderLength || shouldStretch || edgeAlignedLabels ? 0 : HALF_LABEL,
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
            justifyContent: 'flex-start',
            marginTop: scaleVertical(8),
            width: '100%',
            paddingHorizontal: 0,
        },
        labelWrapper: {
            alignItems: 'stretch',
            flex: 1,
        },
        middleLabelWrapper: {
            alignItems: 'stretch',
        },
        leftLabelWrapper: {
            alignItems: 'stretch',
        },
        rightLabelWrapper: {
            alignItems: 'stretch',
        },
        labelText: {
            color: colors.text,
            textAlign: 'center',
            marginTop: 0,
            fontSize: scaleFontSize(10),
            width: '100%',
        },
        middleLabelText: {
            textAlign: 'center',
        },
        leftLabelText: {
            textAlign: 'left',
        },
        rightLabelText: {
            textAlign: 'right',
        },
    });
    return styles;
};
