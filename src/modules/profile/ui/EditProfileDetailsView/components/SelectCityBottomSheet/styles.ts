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
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
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
        listContainer: {
            height: scaleVertical(300),
        },
        listContent: {
            flexGrow: 1,
            gap: scaleVertical(12),
        },
        emptyImage: {
            width: scaleVertical(230),
            height: scaleVertical(230),
            resizeMode: 'cover',
        },
        footer: {
            paddingBottom: bottomInset + scaleVertical(16),
        }
    });

    return styles;
};
