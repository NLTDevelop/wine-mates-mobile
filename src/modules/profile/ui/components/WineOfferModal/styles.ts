import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        scrollView: {
            flexShrink: 1,
        },
        container: {
            paddingTop: scaleVertical(8),
        },
        inputBeforePicker: {
            marginBottom: 0,
        },
        inputAfterPicker: {
            marginTop: scaleVertical(16),
        },
        saveButton: {
            marginTop: scaleVertical(8),
        },
        deleteButton: {
            marginTop: scaleVertical(12),
        },
        deleteButtonText: {
            color: colors.primary,
        },
    });

    return styles;
};
