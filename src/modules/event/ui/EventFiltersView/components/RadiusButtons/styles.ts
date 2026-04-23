import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            gap: scaleHorizontal(4),
        },
        button: {
            flex: 1,
            height: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        buttonSelected: {
            flex: 1,
            height: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.primary,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
        },
        text: {
            color: colors.text_light,
        },
        textSelected: {
            color: colors.text,
        },
    });

    return styles;
};
