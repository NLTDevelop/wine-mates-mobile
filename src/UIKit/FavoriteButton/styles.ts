import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

const DEFAULT_BUTTON_SIZE = scaleVertical(40);

export const getStyles = (colors: IColors, size?: number) => {
    const buttonSize = size || DEFAULT_BUTTON_SIZE;

    const styles = StyleSheet.create({
        favoriteButton: {
            width: buttonSize,
            height: buttonSize,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: buttonSize,
            borderWidth: 1,
            borderColor: colors.primary,
        },
    });
    return styles;
};
