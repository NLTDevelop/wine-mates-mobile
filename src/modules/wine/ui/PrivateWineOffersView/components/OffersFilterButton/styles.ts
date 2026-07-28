import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            width: scaleVertical(44),
            height: scaleVertical(44),
            justifyContent: 'center',
            alignItems: 'center',
        },
        badge: {
            position: 'absolute',
            top: scaleVertical(3),
            right: scaleHorizontal(3),
            minWidth: scaleVertical(16),
            height: scaleVertical(16),
            borderRadius: 8,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            color: colors.text_inverted,
        },
    });

    return styles;
};
