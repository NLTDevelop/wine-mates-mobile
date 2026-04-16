import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderRadius: 20,
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
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        metaRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        metaBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 6,
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            gap: scaleHorizontal(6),
            backgroundColor: colors.background_middle
        },
        metaText: {
            color: colors.text,
        },
        headerContent: {
            gap: scaleVertical(2),
        },
        title: {
            color: colors.text,
        },
        timeText: {
            color: colors.text_light,
            fontSize: scaleFontSize(16),
        },
        descriptionText: {
            color: colors.text_light,
            fontSize: scaleFontSize(18),
            lineHeight: scaleFontSize(26),
        },
        mapContainer: {
            height: scaleVertical(140),
            borderRadius: 14,
            overflow: 'hidden',
        },
        map: {
            ...StyleSheet.absoluteFill,
        },
        footer: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        readMoreButton: {
            flex: 1,
            borderRadius: 16,
        },
    });
    return styles;
};
