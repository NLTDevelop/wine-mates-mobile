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
        androidBaseLayer: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(250,250,250,0.95)',
        },
        androidNoiseLayer: {
            ...StyleSheet.absoluteFill,
        },
        androidNoiseImage: {
            opacity: 0.15,
        },
    });
    return styles;
};
