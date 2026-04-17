import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleVertical(12),
        },
        mainContainer: {
            gap: scaleVertical(4),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        text: {
            color: colors.text_light,
        },
    });
    return styles;
};
