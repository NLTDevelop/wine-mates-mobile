import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { WINDOW_HEIGHT } from '@gorhom/bottom-sheet';

export const getStyles = (colors: IColors, bottomInset: number, topInset: number) => {
    const maxHeight = WINDOW_HEIGHT - topInset;
    
    const styles = StyleSheet.create({
        bottomSheetContainer: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
        },
        container: {
            maxHeight: maxHeight,
            paddingHorizontal: scaleHorizontal(16),
            gap: scaleVertical(16),
            paddingBottom: bottomInset + scaleVertical(16),
        },
        header: {
            marginTop: scaleVertical(15),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        headerSpacer: {
            width: scaleVertical(24),
        },
        contentContainer: {
            flexGrow: 1,
            paddingBottom: scaleVertical(16),
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(16),
        },
        itemSeparator: {
            height: 1,
            backgroundColor: colors.border,
        },
    });

    return styles;
};
