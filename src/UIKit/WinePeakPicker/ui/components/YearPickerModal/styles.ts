import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '@/utils';
import { StyleSheet } from 'react-native';

const scaleBottomPadding = (bottom: number) => Math.max(bottom, scaleVertical(16));

export const getStyles = (colors: IColors, bottom: number) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        backdropPressable: {
            flex: 1,
        },
        modalWrapper: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleBottomPadding(bottom),
            gap: scaleVertical(12),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: scaleVertical(12),
        },
        closeButton: {
            width: scaleHorizontal(24),
            height: scaleVertical(24),
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerSpacer: {
            width: scaleHorizontal(24),
            height: scaleVertical(24),
        },
    });
    return styles;
};
