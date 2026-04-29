import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(12),
            borderWidth: scaleVertical(1),
            borderRadius: 12,
            borderColor: colors.border,
            backgroundColor: colors.background,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(16),
        },
    });
    return styles;
};
