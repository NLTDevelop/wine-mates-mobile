import { StyleSheet } from 'react-native';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        button: {
            width: scaleVertical(32),
            height: scaleVertical(32),
            borderRadius: scaleVertical(32),
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
            marginRight: scaleHorizontal(8)
        },
    });
    return styles;
};
