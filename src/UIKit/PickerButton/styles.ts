import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        containerWithLabel: {
            marginTop: scaleVertical(12),
        },
        label: {
            color: colors.text,
            marginBottom: scaleVertical(6),
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            height: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(16),
            gap: scaleHorizontal(8),
        },
        buttonDisabled: {
            opacity: 0.5,
        },
        text: {
            flex: 1,
        },
    });

    return styles;
};
