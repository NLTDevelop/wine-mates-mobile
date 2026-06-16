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
            justifyContent: 'space-between',
        },
        button: {
            width: '31.5%',
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
        moreButton: {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            paddingHorizontal: 0,
            paddingVertical: 0,
        },
        buttonText: {
            color: colors.text,
            textAlign: 'center',
        },
        moreButtonText: {
            color: colors.primary,
            textDecorationLine: 'underline',
        },
    });

    return styles;
};
