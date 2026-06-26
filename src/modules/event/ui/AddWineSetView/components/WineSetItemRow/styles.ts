import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const WINE_SET_ITEM_ROW_HEIGHT = 76;

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            minHeight: scaleVertical(WINE_SET_ITEM_ROW_HEIGHT),
        },
        dragButton: {
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
        },
        content: {
            flex: 1,
            minHeight: scaleVertical(WINE_SET_ITEM_ROW_HEIGHT),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(12),
            gap: scaleHorizontal(8),
            flexDirection: 'row',
            justifyContent: 'space-between',
           
            backgroundColor: colors.background,
        },
        textContainer: {
            flex: 1,
            marginRight: scaleHorizontal(8),
            gap: scaleVertical(4),
        },
        title: {
            color: colors.text,
        },
        subtitle: {
            color: colors.text_light,
        },
        actions: {
            flexDirection: 'row',
            flexShrink: 0,
        },
        actionButton: {
            width: scaleHorizontal(28),
            height: scaleHorizontal(28),
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return styles;
};
