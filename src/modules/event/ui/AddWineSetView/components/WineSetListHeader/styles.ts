import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(16),
        },
        searchBar: {
            marginBottom: 0,
        },
        searchResultsContainer: {
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            overflow: 'hidden',
            marginTop: scaleVertical(-8),
        },
        searchResultsList: {
            maxHeight: scaleVertical(158),
        },
        emptySearchContainer: {
            gap: scaleVertical(10),
            paddingHorizontal: scaleHorizontal(12),
            paddingVertical: scaleVertical(12),
        },
        emptySearchText: {
            color: colors.text_light,
        },
        searchResultDivider: {
            height: scaleVertical(1),
            backgroundColor: colors.border_light,
        },
        tastingTypeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            gap: scaleHorizontal(8),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
            marginBottom: scaleVertical(16),
        },
        tastingTypeButtonText: {
            color: colors.text,
        },
    });

    return styles;
};
