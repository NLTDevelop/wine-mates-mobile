import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
            gap: scaleVertical(16),
        },
        searchBar: {
            marginBottom: 0,
        },
        tastingTypeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scaleVertical(48),
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            gap: scaleHorizontal(8),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
        },
        tastingTypeButtonText: {
            color: colors.text,
        },
        dropdownContent: {
            marginTop: scaleVertical(10),
            backgroundColor: colors.background,
        },
        listDivider: {
            height: scaleVertical(8),
        },
        divider: {
            height: 1,
            width: '100%',
            backgroundColor: colors.background_light,
        },
        repeatRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        repeatLabel: {
            color: colors.text,
        },
        repeatButton: {
            height: scaleVertical(40),
            borderWidth: 1,
            borderColor: colors.primary,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
        },
        repeatButtonText: {
            color: colors.text,
        },
        createButton: {
            marginTop: 'auto',
        },
    });

    return styles;
};
