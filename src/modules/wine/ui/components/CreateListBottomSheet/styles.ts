import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, bottomInset: number) => {
    const styles = StyleSheet.create({
        bottomSheetContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
        },
        sheetContent: {
            paddingHorizontal: scaleHorizontal(24),
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(16) + bottomInset,
            gap: scaleVertical(24),
        },
        sheetHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        closeIcon: {
            position: 'absolute',
            left: 0,
            padding: scaleHorizontal(4),
        },
        sheetTitle: {
            textAlign: 'center',
        },
        empty: {
            width: scaleVertical(24),
            height: scaleVertical(24),
        },
        inputContainer: {
            marginBottom: 0,
        },
    });
    return styles;
};
