import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginHorizontal: scaleHorizontal(16),
        },
        stateContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        card: {
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            padding: scaleHorizontal(16),
            gap: scaleVertical(12),
        },
        row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        labelContainer: {
            width: scaleHorizontal(116),
            marginRight: scaleHorizontal(4),
            flexShrink: 0,
        },
        label: {
            color: colors.text_light,
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
        wineSetListContainer: {
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(16),
        },
        wineSetItemSeparator: {
            height: scaleVertical(10),
        },
        content: {
            gap: scaleVertical(16),
        },
        footer: {
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
