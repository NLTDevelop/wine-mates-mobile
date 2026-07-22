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
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        input: {
            flex: 1,
            marginBottom: 0,
        },
        deleteButton: {
            width: scaleHorizontal(40),
            height: scaleVertical(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        addButton: {
            alignSelf: 'flex-end',
            paddingHorizontal: scaleHorizontal(4),
            paddingVertical: scaleVertical(10),
        },
        addButtonText: {
            color: colors.primary,
        },
    });

    return styles;
};
