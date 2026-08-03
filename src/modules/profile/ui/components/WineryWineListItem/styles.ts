import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        priceContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(8),
        },
        priceText: {
            color: colors.primary,
            textAlign: 'center',
        },
        addPriceContainer: {
            minHeight: scaleVertical(48),
            width: '100%',
            paddingHorizontal: scaleHorizontal(16),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleHorizontal(8),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.primary,
            borderRadius: 12,
        },
        addPriceText: {
            color: colors.primary,
        },
    });

    return styles;
};
