import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: scaleVertical(212),
            backgroundColor: colors.background,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        lottie: {
            width: scaleVertical(60),
            height: scaleVertical(60),
        },
        text: {
            color: colors.text_light,
        },
    });
    return styles;
};
