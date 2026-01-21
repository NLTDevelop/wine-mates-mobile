import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        lockLayer: {
            position: 'absolute',
            top: 0,
            right: scaleHorizontal(16),
            zIndex: 10,
        },
        centeredLockLayer: {
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        blur: {
            ...StyleSheet.absoluteFill,
            zIndex: 5,
        },
        androidOverlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            zIndex: 5,
        },
    });
    return styles;
};
