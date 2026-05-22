import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleLineHeight } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        text: {
            flex: 1,
            color: colors.text,
            lineHeight: scaleLineHeight(17),
            marginLeft: scaleHorizontal(8),
        },
    });

    return styles;
};
