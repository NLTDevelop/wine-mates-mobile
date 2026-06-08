import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { isIOS, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
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
            flex: 1,
        },
        listContent: {
            flexGrow: 1,
            paddingBottom: isIOS ? scaleVertical(32) : scaleVertical(16),
        },
        divider: {
            height: scaleVertical(1),
            backgroundColor: colors.border_light,
        },
    });

    return styles;
};
