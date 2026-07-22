import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        message: {
            color: colors.text_light,
            textAlign: 'center',
        },
    });

    return styles;
};
