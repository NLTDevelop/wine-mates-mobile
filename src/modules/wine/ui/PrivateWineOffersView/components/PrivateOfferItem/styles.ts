import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            minHeight: scaleVertical(52),
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            marginHorizontal: scaleHorizontal(16),
        },
        name: {
            flex: 1,
        },
        price: {
            width: scaleHorizontal(110),
            minHeight: scaleVertical(34),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary,
            borderRadius: 7,
            paddingHorizontal: scaleHorizontal(8),
        },
        priceText: {
            color: colors.text_inverted,
        },
    });

    return styles;
};
