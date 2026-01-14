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
        mainContainer: {
            marginTop: scaleVertical(120),
        },
        title: {
            marginBottom: scaleVertical(8),
            textAlign: 'center',
            color: colors.primary,
        },
        text: {
            color: colors.text_light,
            textAlign: 'center',
            marginBottom: scaleVertical(24),
            marginHorizontal: scaleHorizontal(30),
            lineHeight: scaleFontSize(14) * 1.4,
        },
        buttonsContainer: {
            gap: scaleVertical(12),
        },
    });
    return styles;
};
