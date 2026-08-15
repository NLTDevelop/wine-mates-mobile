import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, activeColor: string, activeBackgroundColor: string) => {
    const styles = StyleSheet.create({
        container: {
            height: scaleVertical(20),
            paddingHorizontal: scaleHorizontal(6),
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(4),
            borderWidth: scaleVertical(1),
            borderRadius: 20,
        },
        containerInactive: {
            borderColor: colors.border,
            backgroundColor: colors.background_disabled,
        },
        containerActive: {
            borderColor: activeColor,
            backgroundColor: activeBackgroundColor,
        },
        dot: {
            width: scaleVertical(8),
            height: scaleVertical(8),
            borderRadius: 8,
        },
        dotInactive: {
            backgroundColor: colors.icon,
        },
        dotActive: {
            backgroundColor: activeColor,
        },
        text: {
            color: colors.text,
        },
        textInactive: {
            color: colors.icon,
        },
    });

    return styles;
};
