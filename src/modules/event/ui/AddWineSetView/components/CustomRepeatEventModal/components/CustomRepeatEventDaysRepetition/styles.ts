import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
        },
        label: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        weekDaysRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        weekDayButton: {
            minWidth: scaleVertical(36),
            minHeight: scaleVertical(36),
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background_secondary,
        },
        weekDayButtonSelected: {
            backgroundColor: colors.primary,
        },
        weekDayText: {
            color: colors.text,
        },
        weekDayTextSelected: {
            color: colors.background,
        },
    });

    return styles;
};
