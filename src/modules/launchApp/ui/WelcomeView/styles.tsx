import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '@/utils';

const INSET_TOP = initialWindowMetrics?.insets.top || 0;
const INSET_BOTTOM = initialWindowMetrics?.insets.bottom || 0;
const MARGIN_BOTTOM = INSET_BOTTOM + scaleVertical(32);

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: INSET_TOP,
            justifyContent: 'space-between',
            marginHorizontal: scaleHorizontal(16),
        },
        text: {
            marginTop: scaleVertical(80),
            marginBottom: scaleVertical(8),
            color: colors.text_light,
            textAlign: 'center',
        },
        logo: {
            marginBottom: scaleVertical(4),
            color: colors.text_primary,
            textAlign: 'center',
        },
        description: {
            color: colors.text_light,
            textAlign: 'center',
            marginHorizontal: scaleHorizontal(22),
            lineHeight: scaleFontSize(14) * 1.4,
            marginBottom: scaleVertical(87),
        },
        redLineContainer: {
            position: 'absolute',
            top: scaleVertical(300),
            left: scaleHorizontal(-120),
            width: scaleHorizontal(600),
            height: scaleVertical(140),
            overflow: 'visible',
        },
        image: {
            width: scaleHorizontal(343),
            height: scaleVertical(120),
        },
        buttonContainer: {
            gap: scaleVertical(12),
            marginBottom: scaleVertical(16),
        },
        termsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: scaleHorizontal(22),
        },
        termsText: {
            color: colors.text_light,
        },
        linkText: {
            color: colors.text_primary,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
        },
        footer: {
            marginBottom: MARGIN_BOTTOM,
        },
    });
    return styles;
};
