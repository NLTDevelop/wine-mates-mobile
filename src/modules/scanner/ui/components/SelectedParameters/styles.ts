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
            gap: scaleVertical(2),
        },
        itemContainer: {
            minHeight: scaleVertical(48),
            paddingVertical: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(16),
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
        },
        label: {
            color: colors.text_light,
            flexShrink: 1,
        },
    });
    return styles;
};
