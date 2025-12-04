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
        titleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        title: {
            marginBottom: scaleVertical(8),
            marginHorizontal: scaleHorizontal(16),
        },
        text: {
            color: colors.text_light,
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
            gap: scaleVertical(8),
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
        },
        mapListItem: {
            height: scaleVertical(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
        },
        countText: {
            color: colors.text_light,
        },
        slidersListContainer: {
            gap: scaleVertical(10),
            marginBottom: scaleVertical(16),
        },
    });
    return styles;
};
