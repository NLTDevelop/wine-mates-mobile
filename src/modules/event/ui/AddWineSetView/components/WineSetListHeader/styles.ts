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
        tastingTypePickerContainer: {
            marginBottom: scaleVertical(16),
        },
    });

    return styles;
};
