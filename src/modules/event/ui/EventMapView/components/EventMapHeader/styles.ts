import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(12),
        },
        updateButton: {
            color: colors.error,
        },
        updateButtonDisabled: {
            opacity: 0.4,
        },
        filterButton: {
            position: 'relative',
        },
        badge: {
            position: 'absolute',
            top: scaleVertical(6),
            right: scaleHorizontal(6),
            backgroundColor: colors.primary,
            borderRadius: scaleVertical(12),
            width: scaleVertical(12),
            height: scaleVertical(12),
            justifyContent: 'center',
            alignItems: 'center',
        },
        badgeText: {
            color: colors.text_inverted,
        },
        tabRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(16),
        },
        tabsContainer: {
            flex: 1,
            flexDirection: 'row',
            borderBottomWidth: scaleHorizontal(1),
            borderBottomColor: colors.border,
        },
        tab: {
            flex: 1,
            paddingBottom: scaleVertical(6),
            alignItems: 'center',
            position: 'relative',
        },
        activeTabText: {
            color: colors.primary,
        },
        inactiveTabText: {
            color: colors.text_middle,
        },
        activeTabIndicator: {
            position: 'absolute',
            bottom: -scaleVertical(1),
            left: 0,
            right: 0,
            height: scaleVertical(2),
            backgroundColor: colors.error,
        },
    });

    return styles;
};
