import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, maxLabelWidth: number) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(16),
            marginBottom: scaleVertical(24),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        rowsContainer: {
            gap: scaleVertical(4),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        labelContainer: {
            minWidth: maxLabelWidth > 0 ? maxLabelWidth : undefined,
            marginRight: scaleHorizontal(8),
            flexShrink: 0,
        },
        label: {
            color: colors.text_light,
            flexShrink: 0,
        },
        valueContainer: {
            flex: 1,
        },
        value: {
            color: colors.text,
        },
    });
    return styles;
};
