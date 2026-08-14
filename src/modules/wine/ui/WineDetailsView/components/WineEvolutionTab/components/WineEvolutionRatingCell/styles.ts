import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        ratingCell: {
            width: scaleHorizontal(55),
            alignItems: 'center',
            justifyContent: 'center',
        },
        ratingValue: {
            color: colors.text,
            textAlign: 'center',
        },
        ratingReviews: {
            color: colors.text_light,
            textAlign: 'center',
        },
        ratingValueRow: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: scaleHorizontal(2),
        },
    });

    return styles;
};
