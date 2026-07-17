import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            paddingVertical: scaleVertical(12),
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border,
        },
        lastContainer: {
            paddingTop: scaleVertical(12),
        },
        label: {
            marginBottom: scaleVertical(6),
            color: colors.text_light,
        },
    });

    return styles;
};
