import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { getContrastColor } from '@/utils';

export const getStyles = (colors: IColors, backgroundColor: string, fullWidth: boolean = false) => {
    const textColor = getContrastColor(backgroundColor);

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
            color: textColor,
            ...(fullWidth
                ? {
                    flex: 1,
                    flexShrink: 1,
                    minWidth: 0,
                    textAlign: 'center',
                }
                : {
                    maxWidth: scaleHorizontal(268),
                    flexShrink: 1,
                }),
        },
        selectedIndicator: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderRadius: scaleVertical(24),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
    });
    return styles;
};
