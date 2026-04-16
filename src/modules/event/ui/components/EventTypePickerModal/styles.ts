import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(12),
        },
        option: {
            minHeight: scaleVertical(48),
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(16),
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        selectedOption: {
            borderColor: colors.primary,
            backgroundColor: colors.primary,
        },
        optionText: {
            color: colors.text,
        },
        selectedOptionText: {
            color: colors.text_inverted,
        },
    });

    return styles;
};
