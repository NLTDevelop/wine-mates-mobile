import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { colorOpacity, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: scaleHorizontal(8),
        },
        leftContent: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: scaleHorizontal(8),
        },
        image: {
            width: scaleVertical(32),
            height: scaleVertical(32),
            borderRadius: 8,
            backgroundColor: colors.background_light,
        },
        title: {
            color: colors.text,
            flex: 1,
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        ratingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        ratingText: {
            color: colors.text,
        },
        statusBadge: {
            paddingHorizontal: scaleHorizontal(10),
            paddingVertical: scaleVertical(4),
            borderRadius: 12,
        },
        tastedBadge: {
            backgroundColor: colorOpacity(colors.success, 15),
        },
        tastedBadgeText: {
            color: colors.success,
        },
        notStartedBadge: {
            backgroundColor: colorOpacity(colors.warning, 15),
        },
        notStartedBadgeText: {
            color: colors.warning,
        },
        inProgressBadge: {
            backgroundColor: colorOpacity(colors.info, 15),
        },
        inProgressBadgeText: {
            color: colors.info,
        },
        missedBadge: {
            backgroundColor: colorOpacity(colors.error, 15),
        },
        missedBadgeText: {
            color: colors.error,
        },
    });

    return styles;
};
