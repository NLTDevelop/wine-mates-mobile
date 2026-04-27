import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(12),
        },
        metaRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        metaBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: scaleHorizontal(6),
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            gap: scaleHorizontal(6),
            backgroundColor: colors.background_middle,
        },
        metaText: {
            color: colors.text,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        headerContent: {
            gap: scaleVertical(2),
        },
        title: {
            color: colors.text,
            maxWidth: scaleHorizontal(255),
        },
        timeText: {
            color: colors.text_light,
            fontSize: scaleFontSize(16),
        },
        mapContainer: {
            height: scaleVertical(98),
            borderRadius: scaleHorizontal(14),
            overflow: 'hidden',
        },
        map: {
            ...StyleSheet.absoluteFill,
        },
    });

    return styles;
};
