import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            height: scaleVertical(200),
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        picker: {
            flex: 1,
            height: scaleVertical(200),
        },
        itemText: {
            color: colors.text_light,
        },
        selectedItemText: {
            color: colors.primary,
        },
        selectionIndicator: {
            position: 'absolute',
            left: scaleHorizontal(16),
            right: scaleHorizontal(16),
            top: '50%',
            marginTop: scaleVertical(-25),
            height: scaleVertical(50),
            backgroundColor: colors.primary_secondary,
            borderRadius: 12,
            pointerEvents: 'none',
        },
        overlayHidden: {
            backgroundColor: 'transparent',
        },
        itemTextAlign: {
            textAlign: 'center',
        },
    });
    return styles;
};
