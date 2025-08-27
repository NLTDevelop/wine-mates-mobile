import { StyleSheet } from 'react-native';
import { IColors } from '../../../../UIProvider/theme/IColors';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { scaleHorizontal, scaleVertical } from '../../../../utils';

const INSET_TOP = initialWindowMetrics?.insets.top || 0;

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: INSET_TOP,
            alignItems: 'center',
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
            width: scaleHorizontal(296),
            marginBottom: scaleVertical(87),
        },
        image: {
            width: scaleHorizontal(343),
            height: scaleVertical(120),
            marginBottom: scaleVertical(130),
        },
        buttonContainer: {
            width: scaleHorizontal(343),
            gap: scaleVertical(12),
            marginBottom: scaleVertical(16),
        },
        termsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
        },
        termsText: {
            color: colors.text_light,
        },
        linkText: {
            color: colors.text_primary,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
        },
    });
    return styles;
};
