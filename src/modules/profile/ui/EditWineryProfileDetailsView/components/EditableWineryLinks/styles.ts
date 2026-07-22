import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        label: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        list: {
            gap: scaleVertical(8),
        },
        addButton: {
            alignSelf: 'flex-end',
            paddingHorizontal: scaleHorizontal(4),
            paddingVertical: scaleVertical(10),
            marginBottom: scaleVertical(8),
        },
        addButtonText: {
            color: colors.primary,
        },
    });

    return styles;
};
