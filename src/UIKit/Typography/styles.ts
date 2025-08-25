import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleFontSize, scaleLineHeight } from '../../utils';

export const getStyle = (colors: IColors) => {
    const styles = StyleSheet.create({
        h2: {
            fontSize: scaleFontSize(40),
            lineHeight: scaleLineHeight(56),
            fontFamily: 'VisueltPro-Bold',
            fontWeight: '700',
            color: colors.text,
        },
        h3: {
            fontSize: scaleFontSize(24),
            lineHeight: scaleLineHeight(30),
            fontFamily: 'Manrope-Regular',
            fontWeight: '800',
            color: colors.text,
        },
        h4: {
            fontSize: scaleFontSize(20),
            lineHeight: scaleLineHeight(26),
            fontFamily: 'Manrope-Regular',
            fontWeight: '700',
            color: colors.text,
        },
        h5: {
            fontSize: scaleFontSize(18),
            lineHeight: scaleLineHeight(22),
            fontFamily: 'Manrope-Regular',
            fontWeight: '700',
            color: colors.text,
        },
        h6: {
            fontSize: scaleFontSize(16),
            lineHeight: scaleLineHeight(20),
            fontFamily: 'Manrope-Regular',
            fontWeight: '500',
            color: colors.text,
        },
    });
    return styles;
};
