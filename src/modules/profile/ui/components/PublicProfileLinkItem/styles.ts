import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        item: {
            minHeight: scaleVertical(48),
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            paddingHorizontal: scaleHorizontal(8),
        },
        itemText: {
            flex: 1,
            color: colors.text,
        },
    });

    return styles;
};
