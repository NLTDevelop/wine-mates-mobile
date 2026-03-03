import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            position: 'relative',
            width: scaleHorizontal(24),
            height: scaleVertical(24),
            justifyContent: 'center',
            alignItems: 'center',
        },
        badge: {
            position: 'absolute',
            top: -scaleVertical(4),
            right: -scaleHorizontal(4),
            backgroundColor: colors.error,
            borderRadius: scaleHorizontal(10),
            minWidth: scaleHorizontal(14),
            height: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(2),
            justifyContent: 'center',
            alignItems: 'center',
            bottom: scaleVertical(2),
            borderColor: colors.background,
        },
        badgeText: {
            color: colors.background,
            fontSize: scaleFontSize(8)
        },
    });
    return styles;
};
