import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        containerActive: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            opacity: 0.95,
        },
        dragButton: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            flex: 1,
            minHeight: scaleVertical(48),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(12),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
        },
        contentActive: {
            flex: 1,
            minHeight: scaleVertical(48),
            borderWidth: scaleHorizontal(2),
            borderColor: colors.primary,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(12),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background_light,
        },
        title: {
            color: colors.text,
            flex: 1,
            marginRight: scaleHorizontal(8),
        },
        editButton: {
            width: scaleHorizontal(28),
            height: scaleHorizontal(28),
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return styles;
};
