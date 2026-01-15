import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, isPrimary: boolean, isLast: boolean) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: scaleVertical(16),
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: colors.border_light,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        title: {
            color: isPrimary ? colors.text_primary : colors.text,
        },
        text: {
            color: colors.text_light,
        },
    });
    return styles;
};
