import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(24),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scaleVertical(16),
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
        snacksContainer: {
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(16),
        },
        emptyText: {
            color: colors.text_light,
            textAlign: 'center',
        },
        item: {
            marginBottom: scaleVertical(12),
        },
        itemText: {
            marginLeft: scaleVertical(12)
        }
    });
    return styles;
};
