import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleFontSize, scaleLineHeight } from '../../utils';

export const getStyle = (colors: IColors) => {
    const styles = StyleSheet.create({
        h2: {
            fontSize: scaleFontSize(40),
            lineHeight: scaleLineHeight(48),
            fontFamily: 'VisueltPro-Bold',
            fontWeight: '700',
            color: colors.text,
        },
        h3: {
            fontSize: scaleFontSize(24),
            lineHeight: scaleLineHeight(30),
            fontFamily: 'VisueltPro-Medium',
            fontWeight: '500',
            color: colors.text,
        },
        h4: {
            fontSize: scaleFontSize(20),
            lineHeight: scaleLineHeight(26),
            fontFamily: 'VisueltPro-Medium',
            fontWeight: '500',
            color: colors.text,
        },
        h5: {
            fontSize: scaleFontSize(16),
            lineHeight: scaleLineHeight(20),
            fontFamily: 'VisueltPro-Medium',
            fontWeight: '500',
            color: colors.text,
        },
        h6: {
            fontSize: scaleFontSize(16),
            lineHeight: scaleLineHeight(20),
            fontFamily: 'VisueltPro-Regular',
            fontWeight: '400',
            color: colors.text,
        },
        body_400: {
            fontSize: scaleFontSize(14),
            lineHeight: scaleLineHeight(18),
            fontFamily: 'VisueltPro-Regular',
            fontWeight: '400',
            color: colors.text,
        },
        body_500: {
            fontSize: scaleFontSize(14),
            lineHeight: scaleLineHeight(18),
            fontFamily: 'VisueltPro-Medium',
            fontWeight: '500',
            color: colors.text,
        },
        subtitle_12_400: {
            fontSize: scaleFontSize(12),
            lineHeight: scaleLineHeight(16),
            fontFamily: 'VisueltPro-Regular',
            fontWeight: '400',
            color: colors.text,
        }
    });
    return styles;
};
