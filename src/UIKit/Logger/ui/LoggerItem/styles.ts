import { StyleSheet } from 'react-native';
import { IColors } from '../../../../UIProvider/theme/IColors';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginVertical: 10,
            marginHorizontal: 10,
            borderRadius: 8,
            backgroundColor: colors.background_secondary,
        },
        button: {
            justifyContent: 'center',
            padding: 5,
        },
        name: {
            fontSize: 16,
            color: colors.text,
        },
        text: {
            flex: 1,
            color: colors.text,
            textAlign: 'justify',
            marginHorizontal: 10,
        },
    });
    return styles;
};
