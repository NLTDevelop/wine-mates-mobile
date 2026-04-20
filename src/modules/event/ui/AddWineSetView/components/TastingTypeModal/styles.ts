import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(8),
        },
        option: {
            minHeight: scaleVertical(48),
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(16),
            backgroundColor: colors.background,
        },
        optionText: {
            color: colors.text,
        },
        selectedOption: {
            borderColor: colors.primary,
            backgroundColor: colors.primary,
        },
        selectedOptionText: {
            color: colors.text_inverted,
        },
    });

    return styles;
};
