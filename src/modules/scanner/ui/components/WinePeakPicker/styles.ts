import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, isPremiumUser: boolean = true) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(4),
            paddingBottom: scaleVertical(10),
            paddingHorizontal: scaleHorizontal(16),
        },
        infoContainer: {
            marginBottom: scaleVertical(6),
        },
        description: {
            color: colors.text_light,
        },
        pickerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        pickerButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            height: scaleVertical(40),
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            position: 'relative',
            overflow: 'hidden',
            opacity: isPremiumUser ? 1 : 0.6,
        },
        resetButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            width: scaleHorizontal(40),
            height: scaleVertical(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        pickerText: {
            color: colors.text_inverted,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(20),
            gap: scaleVertical(16),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: scaleVertical(16),
        },
        headerSpacer: {
            width: scaleHorizontal(24),
        },
        pickerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        crownIconContainer: {
            position: 'absolute',
            top: scaleVertical(8),
            right: scaleHorizontal(8),
        },
        blurOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 12,
        },
    });
    return styles;
};
