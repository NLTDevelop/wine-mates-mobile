import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(12),
            maxHeight: scaleVertical(420),
        },
        option: {
            minHeight: scaleVertical(56),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(4),
        },
        optionText: {
            flex: 1,
            color: colors.text,
            marginRight: scaleHorizontal(12),
        },
        separator: {
            height: scaleVertical(1),
            backgroundColor: colors.border,
        },
        stateContainer: {
            minHeight: scaleVertical(120),
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyText: {
            color: colors.text_light,
            textAlign: 'center',
        },
        confirmButton: {
            width: '100%',
            marginTop: scaleVertical(12),
        },
    });

    return styles;
};
