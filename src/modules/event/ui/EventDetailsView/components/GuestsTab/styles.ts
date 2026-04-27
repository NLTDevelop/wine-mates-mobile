import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            borderRadius: 12,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
        guestsText: {
            color: colors.text_light,
        },
    });

    return styles;
};
