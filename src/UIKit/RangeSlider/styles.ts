import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

const TRACK_HEIGHT = scaleVertical(8);
const THUMB_SIZE = scaleHorizontal(20);
const TOUCH_SIZE = scaleHorizontal(40);

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            width: '100%',
        },
        sliderWrapper: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        trackContainer: {
            height: THUMB_SIZE,
            width: '100%',
            justifyContent: 'center',
            position: 'relative',
        },
        track: {
            height: TRACK_HEIGHT,
            backgroundColor: '#F4E3E0',
            borderRadius: TRACK_HEIGHT / 2,
            width: '100%',
        },
        activeTrack: {
            height: TRACK_HEIGHT,
            backgroundColor: colors.primary,
            borderRadius: TRACK_HEIGHT / 2,
            position: 'absolute',
        },
        thumbWrapper: {
            position: 'absolute',
            left: -TOUCH_SIZE / 2,
            width: TOUCH_SIZE,
            height: THUMB_SIZE,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3,
        },
        marker: {
            borderWidth: scaleHorizontal(1),
            borderColor: colors.background,
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        labelsContainer: {
            marginTop: scaleVertical(8),
            width: '100%',
            alignItems: 'center',
        },
        labelsContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        labelText: {
            color: colors.text,
        },
    });

    return styles;
};
