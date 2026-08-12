import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        item: {
            minWidth: scaleHorizontal(100),
            flexGrow: 1,
            flexShrink: 0,
            alignItems: 'center',
        },
        text: {
            color: colors.text,
            paddingVertical: scaleVertical(8),
        },
        selectedText: {
            color: colors.primary,
            paddingVertical: scaleVertical(8),
        },
        disabledText: {
            color: colors.text_light,
            opacity: 0.45,
            paddingVertical: scaleVertical(8),
        },
        line: {
            height: scaleVertical(2),
            width: '100%',
        },
        selectedLine: {
            height: scaleVertical(2),
            width: '100%',
            backgroundColor: colors.primary,
        },
    });

    return styles;
};
