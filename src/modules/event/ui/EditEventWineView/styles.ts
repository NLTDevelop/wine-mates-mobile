import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: scaleHorizontal(16),
        },
        title: {
            textAlign: 'center',
            color: colors.text_light,
            marginBottom: scaleVertical(24),
        },
        input: {
            marginBottom: 0,
            backgroundColor: colors.background,
        },
        mainContainer: {
            gap: scaleVertical(12),
            marginBottom: scaleVertical(16),
        },
        button: {
            marginBottom: scaleVertical(16),
        },
    });

    return styles;
};
