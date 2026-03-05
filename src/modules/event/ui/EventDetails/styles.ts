import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, maxLabelWidth: number) => {
    const styles = StyleSheet.create({
        container: {
          marginHorizontal: scaleHorizontal(16),
        },
        loaderContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        card: {
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            padding: scaleHorizontal(16),
            gap: scaleVertical(12),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        labelContainer: {
            minWidth: maxLabelWidth > 0 ? maxLabelWidth : undefined,
            marginRight: scaleHorizontal(8),
            flexShrink: 0,
        },
        label: {
            color: colors.text_light,
            flexShrink: 0,
        },
        valueContainer: {
            flex: 1,
        },
        value: {
            color: colors.text,
        },
        sectionTitle: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        wineSetContainer: {
            gap: scaleVertical(8),
        },
        wineSetText: {
            color: colors.text,
        },
        content: {
            gap: scaleVertical(16),
            paddingBottom: scaleVertical(80),
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            paddingVertical: scaleVertical(16),
            backgroundColor: colors.background,
        },
        bookNowButton: {
            flex: 1,
        },
    });
    return styles;
};
