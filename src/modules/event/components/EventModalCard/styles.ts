import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(12),
        },
        header: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        headerContent: {
            flex: 1,
            gap: scaleVertical(8),
        },
        title: {
            color: colors.text,
            fontWeight: '600',
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
        bookingButton: {
            flex: 1,
        },
    });
    return styles;
};
