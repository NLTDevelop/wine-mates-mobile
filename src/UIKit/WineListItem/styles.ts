import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, removeCardStyles: boolean) => {
    const medalSize = 54;

    const styles = StyleSheet.create({
        container: {
            overflow: 'hidden',
            ...(removeCardStyles
                ? {}
                : {
                      padding: scaleVertical(12),
                      backgroundColor: colors.background,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.border,
                  }),
        },
        content: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            alignItems: 'center',
        },
        imageContainer: {
            width: scaleHorizontal(120),
            height: scaleVertical(286),
            position: 'relative',
            alignSelf: 'stretch',
            backgroundColor: 'transparent',
        },
        similarityBadge: {
            paddingVertical: scaleVertical(4),
            paddingHorizontal: scaleHorizontal(6),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            borderRadius: 12,
        },
        similarityBadgeContainer: {
            position: 'absolute',
            top: scaleVertical(8),
            width: '100%',
            alignItems: 'center',
            zIndex: 20,
        },
        similarityText: {
            color: colors.background,
        },
        image: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
            borderRadius: 12,
            backgroundColor: 'transparent',
        },
        imagePlaceholder: {
            borderRadius: 12,
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
        },
        imagePlaceholderContainer: {
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
        },
        rightColumn: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

        medalContainer: {
            marginBottom: scaleVertical(2),
        },
        titleText: {
            textAlign: 'center',
            marginTop: scaleVertical(12),
        },
        descriptionText: {
            textAlign: 'center',
            color: colors.text_light,
        },
        locationText: {
            color: colors.text_light,
            paddingTop: scaleVertical(2),
            marginTop: -scaleVertical(4),
        },
        rateText: {
            color: colors.text,
        },
        rateReviewText: {
            color: colors.text_light,
        },
        rateContainer: {
            alignItems: 'center',
            marginTop: scaleVertical(4),
            marginBottom: scaleVertical(12),
        },
        starsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        dateContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scaleVertical(12),
            marginBottom: -scaleVertical(6),
        },
        footerContainer: {
            width: '100%',
        },
        pressed: {
            transform: [{ scale: 0.99 }],
        },
    });
    return { styles, medalSize };
};
