import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(16),
        },
        searchButton: {
            height: scaleVertical(48),
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(10),
            paddingHorizontal: scaleHorizontal(16),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
        },
        searchButtonText: {
            color: colors.text_light,
        },
        tastingTypeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            gap: scaleHorizontal(8),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
            marginBottom: scaleVertical(16),
        },
        tastingTypeButtonText: {
            color: colors.text,
        },
    });

    return styles;
};
