import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            marginHorizontal: scaleHorizontal(16),
            gap: scaleHorizontal(12),
            marginBottom: scaleVertical(16),
        },
        image: {
            width: scaleHorizontal(117),
            height: scaleVertical(172),
        },
        medal: {
            marginTop: scaleVertical(8),
            alignItems: 'center',
        },
        detailsContainer: {
            width: scaleHorizontal(214),
            justifyContent: 'space-between',
        },
        mainContainer: {
            width: scaleHorizontal(214),
            gap: scaleVertical(12),
        },
        title: {
            flexShrink: 1,
        },
        description: {
            flexShrink: 1,
        },
        rateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        dropdownItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(14),
        },
        text: {
            color: colors.text_light,
        },
        dropdown: {
            width: '100%',
            minHeight: scaleVertical(36),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        button: {
            height: scaleVertical(40),
            minWidth: scaleHorizontal(162),
        },
        favoriteButton: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: scaleVertical(40),
            borderWidth: 1,
            borderColor: colors.primary,
        },
    });
    return styles;
};
