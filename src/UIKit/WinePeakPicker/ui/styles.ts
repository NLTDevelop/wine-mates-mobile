import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, isPremiumUser: boolean = true) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(4),
            paddingBottom: scaleVertical(16),
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
            flex:1,
            backgroundColor: colors.primary,
            borderRadius: 12,
            height: scaleVertical(40),
            alignItems: 'center',
            justifyContent: 'center',
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
