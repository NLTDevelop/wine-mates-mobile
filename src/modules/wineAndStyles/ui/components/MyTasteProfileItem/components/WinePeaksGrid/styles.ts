import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        text: {
            color: colors.text_light,
        },
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: scaleVertical(8),
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
        },
        gridItem: {
            width: `${(100 - 4) / 3}%`,
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: scaleVertical(12),
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return styles;
};
