import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        nestedCollapseWrapper: {
            marginBottom: scaleVertical(8),
        },
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: scaleHorizontal(8),
            paddingTop: scaleVertical(8),
        },
        gridItem: {
            width: `${(100 - 4) / 3}%`,
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: scaleVertical(12),
            alignItems: 'center',
            justifyContent: 'center',
        },
        yearText: {
            color: colors.text_primary,
        },
        countText: {
            color: colors.text_primary,
            opacity: 0.7,
        },
    });
    return styles;
};
