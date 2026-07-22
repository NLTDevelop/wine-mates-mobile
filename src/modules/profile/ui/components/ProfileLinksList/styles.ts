import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        label: {
            color: colors.text,
            marginLeft: scaleHorizontal(2),
        },
        list: {
            gap: scaleVertical(8),
        },
    });

    return styles;
};
