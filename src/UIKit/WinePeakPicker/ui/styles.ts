import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
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
    });
    return styles;
};
