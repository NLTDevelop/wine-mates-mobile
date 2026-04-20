import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        markerWrapper: {
            width: scaleVertical(42),
            height: scaleVertical(51),
            position: 'relative',
            borderWidth: 0,
            borderColor: colors.background,
        },
        centerIcon: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: scaleVertical(8),
            height: scaleVertical(24),
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return styles;
};
