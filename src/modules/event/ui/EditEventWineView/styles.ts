import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        title: {
            marginTop: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            color: colors.text,
        },
        description: {
            marginTop: scaleVertical(8),
            paddingHorizontal: scaleHorizontal(16),
            color: colors.text_light,
        },
    });

    return styles;
};
