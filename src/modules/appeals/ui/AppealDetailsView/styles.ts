import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        scrollContent: {
            flexGrow: 1,
        },
        container: {
            flex: 1,
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(24),
        },
        card: {
            padding: scaleVertical(16),
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            marginBottom: scaleVertical(16),
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: scaleHorizontal(8),
            paddingBottom: scaleVertical(12),
            borderBottomWidth: scaleVertical(1),
            borderBottomColor: colors.border,
        },
        subject: {
            flex: 1,
        },
        status: {
            paddingHorizontal: scaleHorizontal(10),
            paddingVertical: scaleVertical(5),
            borderRadius: 8,
            backgroundColor: colors.primary_secondary,
        },
        statusText: {
            color: colors.primary,
        },
        actions: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        actionButton: {
            flex: 1,
        },
        deleteText: {
            color: colors.error,
        },
    });

    return styles;
};
