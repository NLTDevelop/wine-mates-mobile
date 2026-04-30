import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) => {
    const styles = StyleSheet.create({
        bottomSheetContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            minHeight: scaleVertical(56),
            position: 'relative',
        },
        titleContainer: {
            position: 'absolute',
            left: scaleHorizontal(16),
            right: scaleHorizontal(16),
            top: scaleVertical(16),
            height: scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        closeButton: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            textAlign: 'center',
            color: colors.text,
        },
        searchContainer: {
            marginHorizontal: scaleHorizontal(16),
            marginTop: scaleVertical(12),
            marginBottom: scaleVertical(16),
        },
        listContentContainer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
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
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingBottom: bottomInset + scaleVertical(16),
            backgroundColor: colors.background,
        },
        confirmButton: {
            width: '100%',
        },
    });

    return styles;
};
