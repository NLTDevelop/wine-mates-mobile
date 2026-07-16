import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        fieldContainer: {
            gap: scaleVertical(6),
        },
        label: {
            color: colors.text,
            marginLeft: scaleHorizontal(2),
        },
        container: {
            minHeight: scaleVertical(48),
            borderRadius: 12,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(13),
            gap: scaleHorizontal(10),
        },
        fieldText: {
            color: colors.text,
        },
        placeholderText: {
            color: colors.text_light,
        },
        leftIcon: {
            marginLeft: scaleHorizontal(2),
        },
    });

    return styles;
};
