import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        limitContainer: {
            borderRadius: 12,
            padding: scaleVertical(12),
            marginBottom: scaleVertical(24),
            borderWidth: 1,
            borderColor: colors.primary,
            marginHorizontal: scaleHorizontal(16),
        },
        countText: {
            color: colors.text_primary,
        },
        selectedParameters: {
            marginHorizontal: scaleHorizontal(16),
        },
        button: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
    });
    return styles;
};
