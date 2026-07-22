import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
        },
        message: {
            color: colors.text_light,
            textAlign: 'center',
        },
        buttons: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        button: {
            flex: 1,
            minHeight: scaleVertical(48),
        },
    });

    return styles;
};
