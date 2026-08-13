import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, topInset: number, bottomInset: number) => {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            top: scaleVertical(86) + topInset,
            bottom: scaleVertical(142) + bottomInset,
            left: scaleHorizontal(24),
            right: scaleHorizontal(24),
        },
        corner: {
            position: 'absolute',
            width: scaleHorizontal(56),
            height: scaleVertical(56),
            borderColor: colors.background,
        },
        topLeftCorner: {
            top: 0,
            left: 0,
            borderTopWidth: scaleHorizontal(4),
            borderLeftWidth: scaleHorizontal(4),
            borderTopLeftRadius: 18,
        },
        topRightCorner: {
            top: 0,
            right: 0,
            borderTopWidth: scaleHorizontal(4),
            borderRightWidth: scaleHorizontal(4),
            borderTopRightRadius: 18,
        },
        bottomLeftCorner: {
            bottom: 0,
            left: 0,
            borderBottomWidth: scaleHorizontal(4),
            borderLeftWidth: scaleHorizontal(4),
            borderBottomLeftRadius: 18,
        },
        bottomRightCorner: {
            right: 0,
            bottom: 0,
            borderRightWidth: scaleHorizontal(4),
            borderBottomWidth: scaleHorizontal(4),
            borderBottomRightRadius: 18,
        },
        labelContainer: {
            position: 'absolute',
            bottom: scaleVertical(-22),
            alignSelf: 'center',
            minHeight: scaleVertical(44),
            paddingHorizontal: scaleHorizontal(18),
            justifyContent: 'center',
            backgroundColor: colors.background,
            borderRadius: 12,
        },
        label: {
            color: colors.text,
            fontSize: scaleHorizontal(16),
            fontWeight: '600',
        },
    });

    return styles;
};
