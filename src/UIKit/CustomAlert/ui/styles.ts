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
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
        },
        header: {
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingBottom: scaleVertical(12),
        },
        headerWithClose: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        headerText: {
            color: colors.text,
            marginLeft: scaleHorizontal(8),
        },
        closeButton: {
            padding: scaleVertical(4),
            marginLeft: scaleHorizontal(8),
        },
        content: {
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(12),
        },
        footer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(12),
            paddingBottom: scaleVertical(16),
        },
    });

    return styles;
};
