import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical, colorOpacity } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
        },
        arrowButton: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            borderRadius: scaleHorizontal(20),
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        cardContainer: {
            width: scaleHorizontal(165),
            height: scaleVertical(283),
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: scaleHorizontal(8),
            borderRadius: scaleHorizontal(12),
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: scaleVertical(12),
        },
        imageContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            paddingHorizontal: scaleHorizontal(12),
            marginBottom: scaleVertical(12),
        },
        imageWrapper: {
            width: scaleHorizontal(84),
            height: scaleVertical(123),
        },
        wineImage: {
            width: '100%',
            height: '100%',
        },
        iconsContainer: {
            gap: scaleVertical(8),
        },
        iconButton: {
            width: scaleHorizontal(32),
            height: scaleHorizontal(32),
            borderRadius: scaleHorizontal(16),
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconButtonShadow: {
            shadowColor: colors.text,
            shadowOffset: {
                width: 0,
                height: scaleVertical(2),
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        iconButtonBorder: {
            borderWidth: 1,
            borderColor: colors.border,
        },
        infoContainer: {
            width: '100%',
            alignItems: 'flex-start',
            paddingHorizontal: scaleHorizontal(12),
        },
        locationBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
            paddingHorizontal: scaleHorizontal(8),
            borderRadius: scaleHorizontal(6),
            borderWidth: 1,
            borderColor: colors.primary,
            backgroundColor: colorOpacity(colors.primary, 10),
            marginBottom: scaleVertical(8),
        },
        locationText: {
            color: colors.primary,
        },
        wineName: {
            marginBottom: scaleVertical(4),
        },
        wineType: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        ratingContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        ratingText: {
            color: colors.text,
        },
        ratingCountText: {
            color: colors.text_light,
        },
    });
    return styles;
};
