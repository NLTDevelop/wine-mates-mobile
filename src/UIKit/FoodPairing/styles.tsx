import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, isLocked: boolean = false) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scaleVertical(12),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        button: {
            height: scaleVertical(36),
            minWidth: scaleHorizontal(109),
        },
        card: {
            borderRadius: 12,
            backgroundColor: colors.background,
            minHeight: isLocked ? scaleVertical(100) : scaleVertical(212),
            paddingVertical: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(16),
            borderWidth: 1,
            borderColor: colors.border,
            maxHeight: isLocked ? scaleVertical(100) : undefined,
        },
        item: {
            marginBottom: scaleVertical(12),
        },
        itemText: {
            marginLeft: scaleHorizontal(12),
            marginTop: scaleVertical(4),
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        emptyText: {
            color: colors.text_light,
            textAlign: 'center',
            maxWidth: '90%',
        },
    });
    return styles;
};
