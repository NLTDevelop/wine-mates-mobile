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
        emptyContainer: {
            minHeight: scaleVertical(120),
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(24),
            paddingVertical: scaleVertical(24),
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: 16,
            backgroundColor: colors.background,
        },
        emptyText: {
            textAlign: 'center',
            color: '#757575',
            lineHeight: scaleVertical(22),
        },
    });

    return styles;
};
