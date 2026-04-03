import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
        },
        message: {
            textAlign: 'center',
            color: colors.text_middle,
        },
        buttonsContainer: {
            gap: scaleVertical(12),
        },
        button: {
            width: '100%',
        },
    });

    return styles;
};
