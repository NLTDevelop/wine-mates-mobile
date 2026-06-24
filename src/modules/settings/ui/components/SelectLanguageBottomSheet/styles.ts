import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            maxHeight: scaleVertical(320),
        },
        contentContainer: {
            flexGrow: 1,
        },
        item: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(4),
        },
        selectedText: {
            color: colors.primary,
        },
    });

    return styles;
};
