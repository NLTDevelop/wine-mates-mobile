import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            justifyContent: 'space-between',
        },
        title: {
            marginBottom: scaleVertical(8),
            textAlign: 'center',
        },
        text: {
            color: colors.text_light,
            textAlign: 'center',
            marginBottom: scaleVertical(16),
            marginHorizontal: scaleHorizontal(65),
            lineHeight: scaleFontSize(14) * 1.4,
        },
        input: {
            marginBottom: 0,
        },
        footer: {
            gap: scaleVertical(24),
        },
    });
    return styles;
};
