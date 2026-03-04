import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(12),
        },
        title: {
            marginBottom: scaleVertical(4),
        },
        answer: {
            color: colors.text_light,
        },
    });
    return styles;
};
