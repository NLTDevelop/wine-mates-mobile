import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
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
        paramContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        label: {
            color: colors.text_light,
            flexShrink: 0,
            marginRight: scaleHorizontal(8),
        },
        value: {
            color: colors.text,
            textAlign: 'left',
            flex: 1,
        },
        columnsContainer: {
            flexDirection: 'row',
        },
        leftColumn: {
            flexShrink: 0,
            marginRight: scaleHorizontal(8),
            gap: scaleVertical(8),
        },
        rightColumn: {
            flex: 1,
            gap: scaleVertical(8),
        },
    });
    return styles;
};
