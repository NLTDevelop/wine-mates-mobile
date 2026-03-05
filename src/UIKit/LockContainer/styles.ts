import { IColors } from '@/UIProvider/theme/IColors';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        centeredLockLayer: {
            ...StyleSheet.absoluteFill,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
        },
        baseLayer: {
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.background,
            borderRadius: 8,
        },
    });
    return styles;
};
