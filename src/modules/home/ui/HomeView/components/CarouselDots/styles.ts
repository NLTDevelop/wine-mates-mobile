import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleHorizontal(4),
        },
        dot: {
            width: scaleVertical(6),
            height: scaleVertical(6),
            borderRadius: scaleVertical(3),
        },
        activeDot: {
            backgroundColor: colors.primary,
        },
        inactiveDot: {
            backgroundColor: colors.border,
        },
    });

    return styles;
};
