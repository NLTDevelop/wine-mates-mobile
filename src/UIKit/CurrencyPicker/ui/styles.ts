import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            minHeight: 0,
        },
        searchContainer: {
            marginTop: scaleVertical(12),
            marginBottom: scaleVertical(16),
        },
        listContentContainer: {
            paddingBottom: scaleVertical(16),
        },
        list: {
            flex: 1,
            minHeight: 0,
        },
        option: {
            minHeight: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
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
            backgroundColor: colors.background,
        },
        selectedOptionText: {
            color: colors.text,
        },
        separator: {
            height: scaleVertical(8),
        },
        emptyContainer: {
            minHeight: scaleVertical(120),
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyText: {
            color: colors.text_light,
            textAlign: 'center',
        },
        footer: {
            paddingTop: scaleVertical(12),
            backgroundColor: colors.background,
        },
        confirmButton: {
            width: '100%',
        },
    });

    return styles;
};
