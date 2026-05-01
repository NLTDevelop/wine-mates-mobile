import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            minHeight: scaleVertical(52),
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(8),
        },
        title: {
            color: colors.text,
        },
        subtitle: {
            color: colors.text_light,
            marginTop: scaleVertical(2),
        },
    });

    return styles;
};
