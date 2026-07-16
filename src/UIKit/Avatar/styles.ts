import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet, TextStyle } from 'react-native';

const FONT_SIZE_RATIO = 0.4;

export const getInitialsTextStyle = (avatarSize: number): TextStyle => {
    const fontSize = avatarSize * FONT_SIZE_RATIO;

    return {
        fontSize,
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
            includeFontPadding: true,
        },
    });
    return styles;
}
