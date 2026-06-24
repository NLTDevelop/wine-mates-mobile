import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            position: 'relative',
            width: scaleVertical(44),
            height: scaleVertical(44),
        },
        badge: {
            position: 'absolute',
            top: scaleVertical(4),
            right: scaleHorizontal(4),
            backgroundColor: colors.primary,
            borderRadius: 12,
            minWidth: scaleVertical(14),
            height: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(2),
            justifyContent: 'center',
            alignItems: 'center',
        },
        badgeText: {
            color: colors.text_inverted,
        },
    });

    return styles;
};
