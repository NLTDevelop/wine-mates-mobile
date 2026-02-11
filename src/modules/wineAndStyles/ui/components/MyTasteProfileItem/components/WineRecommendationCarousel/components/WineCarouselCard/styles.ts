import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

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
            justifyContent: 'center',
            alignItems: 'center',
        },
        cardContainer: {
            flex: 1,
            alignItems: 'center',
            marginHorizontal: scaleHorizontal(8),
        },
        imageContainer: {
            width: scaleHorizontal(120),
            height: scaleVertical(200),
            position: 'relative',
            marginBottom: scaleVertical(12),
        },
        wineImage: {
            width: '100%',
            height: '100%',
        },
        iconsContainer: {
            position: 'absolute',
            top: scaleVertical(8),
            right: scaleHorizontal(8),
            gap: scaleVertical(8),
        },
        iconButton: {
            width: scaleHorizontal(32),
            height: scaleHorizontal(32),
            borderRadius: scaleHorizontal(16),
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.text,
            shadowOffset: {
                width: 0,
                height: scaleVertical(2),
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        infoContainer: {
            width: '100%',
            alignItems: 'center',
        },
        locationBadge: {
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(4),
            borderRadius: scaleHorizontal(12),
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: scaleVertical(8),
        },
        locationText: {
            color: colors.text,
        },
        wineName: {
            textAlign: 'center',
            marginBottom: scaleVertical(4),
        },
        wineType: {
            textAlign: 'center',
            color: colors.textSecondary,
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
    });
    return styles;
};
