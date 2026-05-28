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
            justifyContent: 'space-between',
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
        content: {
            flex: 1,
            overflow: 'hidden',
        },
        list: {
            flex: 1,
        },
        listContent: {
            flexGrow: 1,
            paddingHorizontal: scaleHorizontal(16),
        },
        option: {
            minHeight: scaleVertical(56),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(4),
        },
        optionText: {
            flex: 1,
            color: colors.text,
            marginRight: scaleHorizontal(12),
        },
        separator: {
            height: scaleVertical(1),
            backgroundColor: colors.border,
        },
        stateContainer: {
            flex: 1,
            minHeight: scaleVertical(120),
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyText: {
            color: colors.text_light,
            textAlign: 'center',
        },
        confirmButton: {
            width: '100%',
        },
        footer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingBottom: bottomInset + scaleVertical(16),
            backgroundColor: colors.background,
        },
    });

    return styles;
};
