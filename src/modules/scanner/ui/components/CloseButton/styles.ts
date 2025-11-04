import { StyleSheet } from 'react-native';
import { scaleVertical } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        button: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: scaleVertical(22),
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
    });
    return styles;
};
