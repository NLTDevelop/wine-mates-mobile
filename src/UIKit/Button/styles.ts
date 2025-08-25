import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleLineHeight, scaleVertical } from '../../utils';

export const getStyles = (colors: IColors, type: 'main' | 'secondary' | 'floating', disabled?: boolean) => {
    const MAIN_CONTAINER: ViewStyle = {
        height: scaleVertical(40),
        flexDirection: 'row',
        gap: scaleHorizontal(8),
        borderWidth: 1,
        borderColor: disabled ? colors.card : colors.primary_secondary,
        paddingHorizontal: scaleHorizontal(8),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: disabled ? colors.card : colors.primary_secondary,
        borderRadius: 24,
    };
    const MAIN_TEXT: TextStyle = {
        fontFamily: 'Manrope',
        fontSize: scaleFontSize(16),
        lineHeight: scaleLineHeight(20),
        fontWeight: '600',
        textAlign: 'center',
        color: disabled ? colors.text_light : colors.background,
    };
    const CONTAINERS = {
        main: MAIN_CONTAINER,
        secondary: {
            ...MAIN_CONTAINER,
            borderColor: colors.border_light,
            backgroundColor: 'transparent',
        },
        floating: {
            ...MAIN_CONTAINER,
            borderWidth: 0,
            backgroundColor: 'transparent',
        },
    };
    const TEXT = {
        main: MAIN_TEXT,
        secondary: {
            ...MAIN_TEXT,
            color: colors.primary_secondary,
        },
        floating: {
            ...MAIN_TEXT,
            color: colors.primary_secondary,
        },
    };
    const styles = StyleSheet.create({
        container: CONTAINERS[type],
        text: TEXT[type],
        absoluteSheet: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    return styles;
};
