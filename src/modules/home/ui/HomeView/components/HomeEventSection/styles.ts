import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(8),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: scaleHorizontal(12),
        },
        arrowButton: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: scaleVertical(20),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
        },
        cardContainer: {
            paddingHorizontal: scaleHorizontal(4),
        },
    });

    return styles;
};
