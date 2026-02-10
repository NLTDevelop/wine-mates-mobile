import { IColors } from '@/UIProvider/theme/IColors';
import { StyleSheet } from 'react-native';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(24),
        },
        title: {
            marginBottom: scaleVertical(12),
        },
        itemsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: scaleHorizontal(8),
        },
        item: {
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(6),
            borderRadius: scaleHorizontal(12),
            borderWidth: 1,
            borderColor: colors.border_light,
            backgroundColor: colors.background,
        },
        itemSelected: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
    });

    return styles;
};
