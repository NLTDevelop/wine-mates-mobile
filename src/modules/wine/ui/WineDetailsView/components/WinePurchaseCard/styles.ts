import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            position: 'relative',
        },
        imageContainer: {
            width: '100%',
            height: scaleVertical(190),
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: colors.background_grey,
            position: 'relative',
        },
        image: {
            width: '100%',
            height: '100%',
        },
        imageGradient: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        content: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: 'flex-end',
            paddingHorizontal: scaleHorizontal(14),
            paddingTop: scaleVertical(14),
            paddingBottom: scaleVertical(18),
        },
        title: {
            color: colors.text_inverted,
        },
        titleHighlight: {
            color: colors.warning,
        },
        logoContainer: {
            minHeight: scaleVertical(38),
            marginTop: scaleVertical(12),
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        logo: {
            maxWidth: scaleHorizontal(160),
            height: scaleVertical(38),
        },
        logoDivider: {
            color: colors.text_light,
        },
        wineMatesLogo: {
            width: scaleVertical(38),
            height: scaleVertical(38),
            borderRadius: 9,
        },
        priceContainer: {
            position: 'absolute',
            right: scaleHorizontal(8),
            bottom: scaleVertical(-8),
            minHeight: scaleVertical(34),
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(8),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: scaleVertical(8),
            overflow: 'hidden',
        },
        priceGradient: {
            ...StyleSheet.absoluteFill,
        },
        priceText: {
            color: colors.text_inverted,
        },
    });

    return styles;
};
