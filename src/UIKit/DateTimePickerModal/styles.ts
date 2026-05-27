import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        backdrop: {
            ...StyleSheet.absoluteFillObject,
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
            borderRadius: 16,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(16),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            minHeight: scaleVertical(56),
            position: 'relative',
        },
        titleContainer: {
            position: 'absolute',
            left: scaleHorizontal(40),
            right: scaleHorizontal(40),
            alignItems: 'center',
        },
        title: {
            color: colors.text,
            textAlign: 'center',
        },
        closeButton: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        container: {
            alignItems: 'center',
            gap: scaleVertical(16),
        },
        confirmButton: {
            width: '100%',
        },
    });

    return styles;
};
