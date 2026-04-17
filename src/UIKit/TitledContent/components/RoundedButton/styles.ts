import { StyleSheet } from 'react-native';
import { scaleHorizontal } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors.ts';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            borderRadius: scaleHorizontal(20),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 4,
        }
    })
    return styles;
}
