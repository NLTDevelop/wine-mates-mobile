import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: scaleHorizontal(8),
        },
        sectionLabel: {
            color: colors.text,
            marginTop: scaleVertical(12),
            marginBottom: scaleVertical(8),
        },
        hintRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(3),
            paddingTop: scaleVertical(4),
        },
        hintText: {
            color: colors.text,
            flexShrink: 1,
        },
        starsContainer: {
            alignItems: 'stretch',
            width: '100%',
            marginBottom: scaleVertical(4),
        },
        starRating: {
            width: '100%',
        },
        starContainer: {
            width: '100%',
            alignSelf: 'stretch',
            justifyContent: 'space-between',
        },
        star: {
            marginHorizontal: 0,
        },
    });

    return styles;
};
