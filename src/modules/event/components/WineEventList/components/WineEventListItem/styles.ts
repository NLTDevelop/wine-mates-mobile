import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: scaleHorizontal(16),
            gap: scaleVertical(12),
            borderWidth: 1,
            borderColor: colors.border,
        },
        selectedContainer: {
            borderColor: colors.primary,
            borderWidth: 2,
        },
        header: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        dateBadge: {
            width: scaleHorizontal(56),
            height: scaleHorizontal(56),
            backgroundColor: colors.text,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: scaleVertical(8),
        },
        monthText: {
            color: colors.background,
            fontSize: 10,
            fontWeight: '600',
        },
        dayText: {
            color: colors.background,
            fontSize: 20,
            fontWeight: 'bold',
        },
        headerContent: {
            flex: 1,
            gap: scaleVertical(8),
        },
        title: {
            color: colors.text,
            fontWeight: '600',
        },
        attendeesRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        avatarsContainer: {
            flexDirection: 'row',
        },
        avatar: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
        },
        avatarOverlap: {
            marginLeft: -8,
        },
        attendeesText: {
            color: colors.text,
        },
        infoRow: {
            paddingVertical: scaleVertical(4),
        },
        timeText: {
            color: colors.text_light,
            fontSize: scaleFontSize(16)
        },
        badgesRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.border,
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(6),
            borderRadius: 8,
            gap: scaleHorizontal(4),
        },
        badgeText: {
            color: colors.text,
        },
        mapContainer: {
            height: scaleVertical(120),
            borderRadius: 12,
            overflow: 'hidden',
        },
        map: {
            ...StyleSheet.absoluteFillObject,
        },
        footer: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        readMoreButton: {
            flex: 1,
        },
    });
    return styles;
};
