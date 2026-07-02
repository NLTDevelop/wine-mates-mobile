import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        fullScreenContainer: {
            flex: 1,
            minHeight: 0,
        },
        fullScreenList: {
            flex: 1,
            minHeight: 0,
        },
        fullScreenListContentContainer: {
            flexGrow: 0,
        },
        fullScreenEmptyListContentContainer: {
            flexGrow: 1,
        },
        fullScreenStateContainer: {
            flex: 1,
            minHeight: scaleVertical(120),
            alignItems: 'center',
            justifyContent: 'center',
        },

        regularList: {},
        regularListContentContainer: {
            flexGrow: 0,
        },
        regularEmptyListContentContainer: {
            flexGrow: 1,
        },
        regularStateContainer: {
            minHeight: scaleVertical(120),
            alignItems: 'center',
            justifyContent: 'center',
        },

        option: {
            minHeight: scaleVertical(56),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(4),
        },
        optionTextContainer: {
            flex: 1,
            marginRight: scaleHorizontal(12),
        },
        optionText: {
            color: colors.text,
        },
        optionSubtitle: {
            color: colors.text_light,
            marginTop: scaleVertical(2),
        },
        separator: {
            height: scaleVertical(1),
            backgroundColor: colors.border,
        },
        emptyContainer: {
            minHeight: scaleVertical(120),
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyText: {
            color: colors.text_light,
            textAlign: 'center',
        },
        footer: {
            marginTop: scaleVertical(12),
        },
        confirmButton: {
            width: '100%',
        },
    });

    return styles;
};
