import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
            gap: scaleVertical(16),
        },
        simpleSliderSection: {
            marginTop: scaleVertical(32),
            paddingVertical: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            backgroundColor: colors.background_secondary || colors.background,
            borderRadius: 12,
        },
        sectionTitle: {
            marginBottom: scaleVertical(8),
            color: colors.text,
        },
        valueText: {
            marginBottom: scaleVertical(12),
            color: colors.text_light,
        },
        slider: {
            width: '100%',
            height: scaleVertical(40),
        },
    });
    return styles;
};
