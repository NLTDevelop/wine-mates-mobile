import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        tasted: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            paddingVertical: scaleVertical(4),
            backgroundColor: colors.primary_secondary,
            gap: scaleHorizontal(4),
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
        },
        tastedText: {
            color: colors.primary,
        },
        title: {
            marginBottom: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        selectedColor: {
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
            height: scaleVertical(50),
        },
        mapListContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            columnGap: scaleHorizontal(8),
            rowGap: scaleVertical(8),
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
        },
        mapListItem: {
            width: scaleHorizontal(109),
            height: scaleVertical(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
        },
        countText: {
            color: colors.text_light,
        },
    });
    return styles;
};
