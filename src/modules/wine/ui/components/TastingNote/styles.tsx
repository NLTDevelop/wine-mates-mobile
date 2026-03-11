import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: scaleVertical(12),
        },
        noteContainer: {
            borderRadius: 12,
            paddingVertical: scaleVertical(14),
            paddingHorizontal: scaleHorizontal(16),
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
        },
        button: {
            marginTop: scaleVertical(8),
            alignSelf: 'flex-end',
        },
    });
    return styles;
};
