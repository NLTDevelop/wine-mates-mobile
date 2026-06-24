import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            maxHeight: scaleVertical(420),
            gap: scaleVertical(16),
        },
        contentContainer: {
            flexGrow: 1,
            paddingBottom: scaleVertical(16),
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(16),
        },
        itemSeparator: {
            height: scaleVertical(1),
            backgroundColor: colors.border,
        },
    });

    return styles;
};
