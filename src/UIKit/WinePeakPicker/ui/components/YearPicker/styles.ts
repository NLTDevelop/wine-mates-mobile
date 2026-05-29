import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const YEAR_PICKER_ITEM_HEIGHT = scaleVertical(50);
export const YEAR_PICKER_VISIBLE_ITEM_COUNT = 5;
const YEAR_PICKER_HEIGHT = YEAR_PICKER_ITEM_HEIGHT * YEAR_PICKER_VISIBLE_ITEM_COUNT;

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: YEAR_PICKER_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        picker: {
            width: '100%',
        },
        itemContainer: {
            height: YEAR_PICKER_ITEM_HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
        },
        itemText: {
            color: colors.text_light,
            textAlign: 'center',
            lineHeight: YEAR_PICKER_ITEM_HEIGHT + scaleVertical(4),
            includeFontPadding: false,
        },
        selectionIndicator: {
            position: 'absolute',
            left: scaleHorizontal(16),
            right: scaleHorizontal(16),
            top: '50%',
            marginTop: -YEAR_PICKER_ITEM_HEIGHT / 2,
            height: YEAR_PICKER_ITEM_HEIGHT,
            backgroundColor: colors.primary_secondary,
            borderRadius: 12,
            pointerEvents: 'none',
        },
        overlayHidden: {
            backgroundColor: 'transparent',
        },
    });
    return styles;
};
