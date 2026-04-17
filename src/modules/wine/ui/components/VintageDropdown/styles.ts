import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        dropdown: {
            width: '100%',
            minHeight: scaleVertical(36),
        },
        rateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            paddingVertical: scaleVertical(4),
        },
        ratingInfoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        ratingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        dropdownItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(4),
            paddingHorizontal: scaleHorizontal(14),
        },
    });
    return styles;
};
