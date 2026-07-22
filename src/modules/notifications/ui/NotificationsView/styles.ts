import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        list: {
            flex: 1,
        },
        listContent: {
            flexGrow: 1,
            paddingBottom: scaleVertical(24),
        },
        markAllButton: {
            minHeight: scaleVertical(40),
            maxWidth: scaleHorizontal(116),
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        markAllText: {
            color: colors.primary,
            textAlign: 'right',
        },
        disabledText: {
            color: colors.text_light,
        },
    });

    return styles;
};
