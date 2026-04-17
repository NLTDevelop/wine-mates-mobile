import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        tooltipContainer: {
            backgroundColor: colors.background,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
            paddingBottom: scaleVertical(2),
            borderWidth: 0,
            borderColor: colors.border_light,
            shadowColor: colors.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
        },
        popoverBackground: {
            backgroundColor: 'transparent',
        },
    });

    return styles;
};
