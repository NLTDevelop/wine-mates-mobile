import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { colorOpacity, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        title: {
        },
        sliderContainer: {
            width: '92%',
            marginHorizontal: scaleVertical(12),
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        tooltipContainer: {
          marginBottom: scaleVertical(16)
        },
        ratingDescriptionContainer: {
            marginBottom: scaleVertical(6),
        },
        ratingDescriptionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        ratingDescription: {
            color: colors.text,
            opacity: 0.7,
        },
        starsContainer: {
            alignItems: 'center',
            marginLeft: scaleHorizontal(24),
        },
        star: {
            marginRight: scaleHorizontal(24),
        },
        starIconContainer: {
            justifyContent: 'center',
        },
        starFillOverlay: {
            position: 'absolute',
            overflow: 'hidden',
        },
        decoratorItem: {
            width: scaleHorizontal(2),
            backgroundColor: colors.background,
            height: '100%'
        },
        activeTrack: {
            backgroundColor: colors.selectedSlider
        },
        medalContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        tooltipContent: {
            gap: scaleVertical(4),
        },
        tooltipRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        tooltipText: {
            color: colors.text,
            paddingTop: scaleVertical(1)
        }
    });

    const tooltipIconSize = {
        width: scaleHorizontal(24),
        height: scaleHorizontal(24)
    };

    const tooltipIconColor = colorOpacity(colors.text, 45) || colors.border_light;

    const tooltipMinWidth = scaleHorizontal(280);

    return { styles, tooltipIconSize, tooltipIconColor, tooltipMinWidth };
};
