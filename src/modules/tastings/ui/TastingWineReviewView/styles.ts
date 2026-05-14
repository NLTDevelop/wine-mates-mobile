import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        title: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        inputContainer: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        input: {
            height: scaleVertical(178),
            maxHeight: scaleVertical(178),
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
