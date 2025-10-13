import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
        },
        mainContainer: {
            flex: 1,
        },
        title: {
            textAlign: 'center',
            marginBottom: scaleVertical(8),
        },
        role: {
            color: colors.primary,
            textAlign: 'center',
            marginBottom: scaleVertical(24),
        },
        formContainer: {
            gap: scaleVertical(16),
        },
        footer: {
            gap: scaleVertical(24),
        },
    });
    return styles;
};
