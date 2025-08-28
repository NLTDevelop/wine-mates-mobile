import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '../../utils';

export const getStyles = (colors: IColors, type: 'main' | 'secondary' | 'auth') => {
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
    const CONTAINERS: Record<typeof type, ViewStyle> = {
        main: MAIN_CONTAINER,
        secondary: {
            ...MAIN_CONTAINER,
            backgroundColor: colors.background,
        },
        auth: {
            ...MAIN_CONTAINER,
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            borderColor: colors.border_light,
        },
    };

    const TEXT: Record<typeof type, TextStyle> = {
        main: MAIN_TEXT,
        secondary: {
            ...MAIN_TEXT,
            color: colors.text,
        },
        auth: {
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
