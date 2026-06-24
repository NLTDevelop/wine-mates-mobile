import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(8),
        },
        sectionHeader: {
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
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
        },
        card: {
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
            borderRadius: scaleHorizontal(12),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
            gap: scaleVertical(10),
        },
        cardContainer: {
            paddingHorizontal: scaleHorizontal(4),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: scaleHorizontal(8),
        },
        authorRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        authorName: {
            flex: 1,
        },
        createdAt: {
            color: colors.text_light,
        },
        text: {
            lineHeight: scaleVertical(20),
        },
        statsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(16),
        },
        stat: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(6),
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
