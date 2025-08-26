import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '../../utils';

export const getStyles = (colors: IColors, type: 'main' | 'secondary') => {
    const MAIN_CONTAINER: ViewStyle = {
        height: scaleVertical(48),
        flexDirection: 'row',
        gap: scaleHorizontal(8),
        borderWidth: 1,
        borderColor: colors.primary,
        paddingHorizontal: scaleHorizontal(8),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 12,
    };
    const MAIN_TEXT: TextStyle = {
        textAlign: 'center',
        color: colors.text_inverted,
    };
    const CONTAINERS = {
        main: MAIN_CONTAINER,
        secondary: {
            ...MAIN_CONTAINER,
            backgroundColor: 'transparent',
        },
    };
    const TEXT = {
        main: MAIN_TEXT,
        secondary: {
            ...MAIN_TEXT,
            color: colors.text,
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
