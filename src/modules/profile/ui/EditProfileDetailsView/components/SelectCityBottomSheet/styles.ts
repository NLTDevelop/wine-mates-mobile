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
            maxHeight,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: bottomInset + scaleVertical(16),
            gap: scaleVertical(16),
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
        closeButton: {
            width: scaleVertical(24),
            height: scaleVertical(24),
        },
        searchContainer: {
            marginBottom: scaleVertical(8),
        },
        searchIconContainer: {
            marginLeft: scaleHorizontal(12),
            marginRight: scaleHorizontal(-4),
            alignItems: 'center',
            justifyContent: 'center',
        },
        list: {
            minHeight: scaleVertical(180),
        },
        listContent: {
            paddingBottom: scaleVertical(8),
            gap: scaleVertical(12),
        },
        emptyContainer: {
            minHeight: scaleVertical(120),
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(16),
        },
        emptyImage: {
            width: scaleVertical(230),
            height: scaleVertical(230),
            resizeMode: 'cover',
        },
        emptyText: {
            textAlign: 'center',
            color: colors.text,
        },
        loader: {
            marginTop: scaleVertical(8),
        },
    });

    return styles;
};
