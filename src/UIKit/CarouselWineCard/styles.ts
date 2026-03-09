import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const medalSize = 54;

    const styles = StyleSheet.create({
        container: {
            padding: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
        },
        content: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        imageContainer: {
            width: '34.6%',
            position: 'relative',
            alignSelf: 'stretch',
        },
        image: {
            position: 'absolute',
            width: '100%',
            minHeight: scaleVertical(220),
        },
        imagePlaceholder: {
            borderRadius: 12,
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
            textAlign: 'center',
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
        reviewSection: {
            gap: scaleVertical(4),
            marginTop: scaleVertical(8),
        },
        userRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        text: {
            color: colors.text_light,
        },
    });
    return { styles };
};
