import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, removeCardStyles: boolean) => {
    const medalSize = 54;

    const styles = StyleSheet.create({
        container: {
            overflow: 'hidden',
            ...removeCardStyles ? {} : {
                padding: scaleVertical(12),
                paddingHorizontal: scaleHorizontal(12),
                backgroundColor: colors.background,
                borderRadius: 12,
                shadowColor: colors.shadow,
                shadowOpacity: 0.12,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
            }
        },
        content: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            overflow: 'hidden'
        },
        imageContainer: {
            width: '34.6%',
            position: 'relative',
            alignSelf: 'stretch',
        },
        similarityBadge: {
            position: 'absolute',
            top: scaleVertical(8),
            left: scaleHorizontal(8),
            padding: scaleHorizontal(4),
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.primary,
            borderRadius: scaleHorizontal(40),
            zIndex: 20,
        },
        similarityText: {
            color: colors.background,
        },
        image: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            minHeight: scaleVertical(200),
        },
        imagePlaceholder: {
            borderRadius: 12,
            minHeight: scaleVertical(200),
        },
        imagePlaceholderContainer: {
            width: '100%',
            flex: 1,
            minHeight: scaleVertical(200),
        },
        rightColumn: {
            flex: 1,
            alignItems: 'center',
        },
        expertReviewText: {
          fontSize: scaleFontSize(10),
            marginTop: -scaleVertical(4),
            color: colors.text_light,
        },
        medalContainer: {
            width: scaleHorizontal(medalSize),
            height: scaleHorizontal(medalSize),
            borderRadius: medalSize,
            overflow: 'hidden',
            marginBottom: scaleVertical(6),
        },
        titleText: {
            textAlign: 'center'
        },
        locationText: {
            color: colors.text_light,
            paddingTop: scaleVertical(2),
            marginTop: -scaleVertical(4),
        },
        rateText: {
            color: colors.text,
            paddingTop: scaleVertical(2),
        },
        rateReviewText: {
            color: colors.text_light,
            paddingTop: scaleVertical(2),
            marginTop: -scaleVertical(4),
        },
        rateContainer: {
            alignItems: 'center',
        },
        starsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
        },
        star: {
            marginHorizontal: scaleHorizontal(1),
        },
        dateContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: scaleVertical(12),
            marginBottom: -scaleVertical(6),
        },
        footerContainer: {
            flexGrow: 1,
            minHeight: scaleVertical(20),
            width: '100%',
            justifyContent: 'flex-end',
        },
        pressed: {
            opacity: 0.6,
        },
    });
    return { styles, medalSize };
};
