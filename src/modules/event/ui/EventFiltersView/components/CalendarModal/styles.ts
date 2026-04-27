import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: colors.text,
            opacity: 0.4,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: scaleHorizontal(16),
        },
        modalCard: {
            backgroundColor: colors.background,
            borderRadius: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: scaleVertical(12),
            position: 'relative',
        },
        closeButton: {
            position: 'absolute',
            right: scaleHorizontal(12),
            width: scaleHorizontal(36),
            height: scaleVertical(36),
            justifyContent: 'center',
            alignItems: 'center',
        },
        calendar: {
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 8,
            marginBottom: scaleVertical(16),
        },
        closeActionButton: {
            marginHorizontal: scaleHorizontal(16),
        },
    });

    return styles;
};
