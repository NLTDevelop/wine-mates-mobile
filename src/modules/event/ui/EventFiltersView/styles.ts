import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
            gap: scaleVertical(16),
        },
        resetButton: {
            minWidth: scaleHorizontal(44),
            alignItems: 'flex-end',
        },
        resetText: {
            color: colors.text_primary,
        },
        resetTextDisabled: {
            color: colors.text_light,
        },
        sectionTitle: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        dateButton: {
            height: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: scaleHorizontal(16),
            backgroundColor: colors.background,
        },
        dateText: {
            color: colors.text,
        },
        sexButton: {
            height: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 8,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: scaleHorizontal(16),
            backgroundColor: colors.background,
        },
        sexText: {
            color: colors.text,
        },
    });

    return styles;
};
