import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            padding: scaleVertical(16),
            marginBottom: scaleVertical(12),
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
        },
        content: {
            flex: 1,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: scaleHorizontal(8),
        },
        subject: {
            flex: 1,
        },
        status: {
            paddingHorizontal: scaleHorizontal(8),
            paddingVertical: scaleVertical(4),
            borderRadius: scaleVertical(16),
            backgroundColor: colors.primary_secondary,
        },
        statusText: {
            color: colors.primary,
        },
        description: {
            marginTop: scaleVertical(8),
            color: colors.text_middle,
        },
        date: {
            marginTop: scaleVertical(8),
            color: colors.text_light,
        },
    });

    return styles;
};
