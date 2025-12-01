import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, backgroundColor: string) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(12),
            justifyContent: 'center',
            minHeight: scaleVertical(48),
            backgroundColor,
            gap: scaleHorizontal(8),
        },
        text: {
            color: colors.text_inverted,
            maxWidth: scaleHorizontal(268),
            flexShrink: 1,
        },
        selectedContainer: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderRadius: scaleVertical(24),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        }
    });
    return styles;
};
