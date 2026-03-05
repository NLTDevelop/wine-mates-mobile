import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet, TextStyle } from 'react-native';

const FONT_SIZE_RATIO = 0.44;
const FONT_VERTICAL_OFFSET_RATIO = 0.1;

export const getInitialsTextStyle = (avatarSize: number): TextStyle => {
    const fontSize = avatarSize * FONT_SIZE_RATIO;

    return {
        fontSize,
        lineHeight: fontSize,
        transform: [{ translateY: fontSize * FONT_VERTICAL_OFFSET_RATIO }],
    };
};

export const getStyle = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            overflow: 'hidden',
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: 100,
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatar: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: 50,
        },
        initials: {
            textAlign: 'center',
            includeFontPadding: false,
        },
    });
    return styles;
}
