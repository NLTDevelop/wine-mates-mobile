import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(6),
            marginBottom: scaleVertical(16),
        },
        label: {
            color: colors.text,
            marginLeft: scaleHorizontal(2),
        },
    });

    return styles;
};
