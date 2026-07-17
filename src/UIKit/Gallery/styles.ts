import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
        },
        header: {
            minHeight: scaleVertical(28),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        title: {
            color: colors.text,
        },
        addButton: {
            minWidth: scaleHorizontal(72),
            minHeight: scaleVertical(28),
            alignItems: 'flex-end',
            justifyContent: 'center',
        },
        addButtonText: {
            color: colors.primary,
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.primary,
            paddingBottom: scaleVertical(1),
        },
        listContent: {
            gap: scaleHorizontal(8),
            marginTop: scaleVertical(8),
        },
        viewer: {
            flex: 1,
            backgroundColor: '#000000',
        },
        viewerList: {
            flex: 1,
        },
        closeViewerButton: {
            position: 'absolute',
            right: scaleHorizontal(16),
            width: scaleVertical(44),
            height: scaleVertical(44),
            borderRadius: scaleVertical(24),
            backgroundColor: colors.background + '4D',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            elevation: 1,
        },
    });

    return styles;
};
