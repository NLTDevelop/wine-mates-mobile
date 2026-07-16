import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        alertContainer: {
            width: scaleHorizontal(327),
            backgroundColor: colors.background,
            borderRadius: scaleVertical(12),
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            overflow: 'hidden',
        },
        header: {
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingBottom: scaleVertical(12),
        },
        headerWithClose: {
            position: 'relative',
            minHeight: scaleVertical(28),
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerText: {
            color: colors.text,
            paddingHorizontal: scaleHorizontal(36),
            textAlign: 'center',
        },
        closeButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            padding: scaleVertical(4),
        },
        content: {
            paddingHorizontal: scaleHorizontal(16),
        },
        footer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingBottom: scaleVertical(16),
        },
    });

    return styles;
};
