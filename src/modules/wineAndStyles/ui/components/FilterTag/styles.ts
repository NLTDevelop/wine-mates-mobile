import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '@/utils';

export const getStyles = (colors: IColors) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary,
            borderRadius: scaleVertical(16),
            marginRight: scaleHorizontal(12)
        },
        label: {
            textAlign: 'center',
            color: colors.background,
            marginRight: scaleHorizontal(6),
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(6),
        },
        closeButton: {
            marginRight: scaleHorizontal(16),
        },
    });
};
