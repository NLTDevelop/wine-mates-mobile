import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(16),
        },
        inputContainer: {
            marginBottom: 0,
        },
        hintText: {
            color: _colors.text_light,
        },
        button: {
            marginTop: scaleVertical(8),
        },
    });

    return styles;
};
