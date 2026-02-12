import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize } from '@/utils';

export const getStyle = (colors: IColors) => {
    const styles = StyleSheet.create({
        h2: {
            fontSize: scaleFontSize(40),
            fontFamily: 'VisueltPro-Bold',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        h3: {
            fontSize: scaleFontSize(24),
            fontFamily: 'VisueltPro-Medium',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        h4: {
            fontSize: scaleFontSize(18),
            fontFamily: 'VisueltPro-Medium',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        h5: {
            fontSize: scaleFontSize(16),
            fontFamily: 'VisueltPro-Medium',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        h6: {
            fontSize: scaleFontSize(16),
            fontFamily: 'VisueltPro-Regular',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        body_400: {
            fontSize: scaleFontSize(14),
            fontFamily: 'VisueltPro-Regular',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        body_500: {
            fontSize: scaleFontSize(14),
            fontFamily: 'VisueltPro-Medium',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        subtitle_12_400: {
            fontSize: scaleFontSize(12),
            fontFamily: 'VisueltPro-Regular',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        subtitle_12_500: {
            fontSize: scaleFontSize(12),
            fontFamily: 'VisueltPro-Medium',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        subtitle_20_500: {
            fontSize: scaleFontSize(20),
            fontFamily: 'VisueltPro-Medium',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
        subtitle_20_700: {
            fontSize: scaleFontSize(20),
            fontFamily: 'VisueltPro-Bold',
            color: colors.text,
            flexShrink: 1,
            includeFontPadding: false,
        },
    });
    return styles;
};
