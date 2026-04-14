import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        item: {
            minHeight: scaleVertical(48),
            borderRadius: scaleHorizontal(12),
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            paddingHorizontal: scaleHorizontal(12),
            justifyContent: 'center',
        },
        itemText: {
            color: colors.text,
        },
    });

    return styles;
};
