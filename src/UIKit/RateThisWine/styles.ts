import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { STAR_GAP } from './constants';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        title: {
            marginRight: scaleHorizontal(12),
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
            marginHorizontal: 0,
            marginLeft: 0,
            marginRight: scaleHorizontal(STAR_GAP),
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

    return styles;
};
