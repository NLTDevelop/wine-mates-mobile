import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginTop: scaleVertical(12),
        },
        title: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        row: {
            justifyContent: 'flex-start',
            columnGap: scaleHorizontal(10),
        },
        button: {
            width: '31%',
            minHeight: scaleVertical(44),
            borderRadius: scaleVertical(12),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(6),
            marginBottom: scaleVertical(8),
        },
        buttonActive: {
            borderColor: colors.primary,
        },
        buttonDisabled: {
            opacity: 0.5,
        },
        buttonText: {
            color: colors.text,
            textAlign: 'center',
        },
        buttonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: scaleHorizontal(3),
            maxWidth: '100%',
        },
        buttonTitleText: {
            flexShrink: 1,
        },
        buttonTextDisabled: {
            color: colors.text_light,
        },
        moreButtonText: {
            color: colors.primary,
            textDecorationLine: 'underline',
        },
    });

    return styles;
};
