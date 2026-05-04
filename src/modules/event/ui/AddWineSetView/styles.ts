import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
        listHeader: {
            gap: scaleVertical(16),
        },
        listFooter: {
            gap: scaleVertical(16),
            paddingTop: scaleVertical(16),
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
        searchLoadingContainer: {
            minHeight: scaleVertical(52),
            alignItems: 'center',
            justifyContent: 'center',
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
        listDivider: {
            height: scaleVertical(8),
        },
        divider: {
            height: scaleVertical(1),
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
            borderWidth: scaleHorizontal(1),
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
            marginTop: scaleVertical(8),
        },
    });

    return styles;
};
