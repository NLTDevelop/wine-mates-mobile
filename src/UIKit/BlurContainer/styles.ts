import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        lockLayer: {
            position: 'absolute',
            top: 0,
            right: scaleHorizontal(16),
            zIndex: 10,
        },
        centeredLockLayer: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -scaleVertical(12) }, { translateY: -scaleVertical(12) }],
            zIndex: 10,
        },
        blur: {
            ...StyleSheet.absoluteFillObject,
            zIndex: 5,
        },
        fakeBlur: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: `${colors.background}A6`,
        },
    });
    return styles;
};
