import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical, scaleFontSize } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
        },
        content: {
            flex: 1,
            paddingTop: scaleVertical(24),
        },
        warningText: {
            color: colors.text,
            marginBottom: scaleVertical(32),
        },
        listContainer: {
            marginBottom: scaleVertical(32),
            gap: scaleVertical(8),
        },
        listItem: {
            color: colors.text,
            fontSize: scaleFontSize(16),
            lineHeight: 16,
        },
        questionText: {
            color: colors.text,
        },
        checkboxContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            paddingVertical: scaleVertical(8),
        },
        checkboxLabel: {
            flex: 1,
            color: colors.text,
            fontSize: scaleFontSize(14),
        },
        buttonContainer: {
            paddingBottom: scaleVertical(24),
            gap: scaleVertical(12),
        },
        deleteButton: {
            width: '100%',
        },
        cancelButton: {
            width: '100%',
        },
    });
    return styles;
};
