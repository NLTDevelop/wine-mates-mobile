import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        card: {
            width: '100%',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(16),
        },
        content: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
        },
    });
    return styles;
};
