import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';
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
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        baseLayer: {
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border_light,
        },
    });
    return styles;
};
