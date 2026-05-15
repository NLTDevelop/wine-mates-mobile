import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
        },
        label: {
            color: colors.text,
        },
        endConditionRow: {
            flexDirection: 'row',
            marginTop: scaleVertical(8),
            justifyContent: 'space-between',
        },
        endConditionLabelButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        endConditionText: {
            color: colors.text,
            marginLeft: scaleHorizontal(8),
        },
        endConditionDropdown: {
            height: scaleVertical(48),
            width: scaleHorizontal(181),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border_light,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(16),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
        },
        endConditionDropdownDisabled: {
            opacity: 0.5,
        },
        dateButtonText: {
            color: colors.text,
        },
        dateButtonTextDisabled: {
            color: colors.text_light,
        },
        checkbox: {
            width: scaleVertical(16),
            height: scaleVertical(16),
        },
    });

    return styles;
};
