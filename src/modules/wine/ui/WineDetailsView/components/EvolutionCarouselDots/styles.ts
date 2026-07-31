import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleHorizontal(6),
            height: scaleVertical(6),
        },
        activeDot: {
            width: scaleHorizontal(20),
            height: scaleVertical(6),
            borderRadius: scaleVertical(6),
            backgroundColor: colors.primary,
        },
        inactiveDot: {
            width: scaleHorizontal(6),
            height: scaleVertical(6),
            borderRadius: scaleVertical(6),
            backgroundColor: colors.border,
        },
    });

    return styles;
};
