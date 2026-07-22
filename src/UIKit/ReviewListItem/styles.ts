import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            backgroundColor: colors.background,
            marginHorizontal: scaleHorizontal(16),
            gap: scaleVertical(9),
            padding: scaleVertical(12),
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
        },
        row: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        expertRateContainer: {
            position: 'relative',
            backgroundColor: colors.background_light,
            borderRadius: 12,
            paddingVertical: scaleVertical(2),
            paddingHorizontal: scaleHorizontal(8),
        },
        mainContainer: {
            flex: 1,
            gap: scaleVertical(4),
        },
        rateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        date: {
            color: colors.text_light,
        },
        reviewContainer: {
            position: 'relative',
            borderRadius: 8,
        },
    });
    return styles;
};
