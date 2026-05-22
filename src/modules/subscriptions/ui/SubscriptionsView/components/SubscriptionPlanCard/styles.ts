import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleLineHeight, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, isPopular?: boolean, isSelected?: boolean) => {
    const styles = StyleSheet.create({
        container: {
            width: scaleHorizontal(99),
            height: scaleVertical(161),
            justifyContent: 'flex-end',
        },
        card: {
            width: scaleHorizontal(99),
            height: isPopular ? scaleVertical(161) : scaleVertical(140),
            borderRadius: scaleVertical(12),
            borderWidth: isPopular ? 0 : 1,
            borderColor: isSelected ? colors.primary : colors.border,
            backgroundColor: isPopular ? colors.primary : colors.background,
            overflow: 'hidden',
        },
        popularBadge: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: scaleVertical(23),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
        },
        popularText: {
            color: colors.text_inverted,
            lineHeight: scaleVertical(14),
        },
        contentContainer: {
            alignItems: 'center',
            justifyContent: 'space-between',
            height: isPopular ? scaleVertical(138) : scaleVertical(140),
            width: isPopular ? scaleHorizontal(95) : scaleHorizontal(99),
            marginLeft: isPopular ? scaleHorizontal(2) : 0,
            marginTop: isPopular ? scaleVertical(21) : 0,
            paddingHorizontal: scaleHorizontal(4),
            paddingTop: scaleVertical(12),
            paddingBottom: scaleVertical(12),
            backgroundColor: colors.background,
            borderBottomLeftRadius: isPopular ? 12 : 0,
            borderBottomRightRadius: isPopular ? 12 : 0,
        },
        durationContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        discountBadge: {
            paddingHorizontal: scaleHorizontal(3),
            paddingVertical: scaleVertical(2),
            borderRadius: scaleVertical(8),
            backgroundColor: colors.primary,
        },
        discountText: {
            color: colors.text_inverted,
            lineHeight: scaleLineHeight(14),
        },
        priceContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return styles;
};
