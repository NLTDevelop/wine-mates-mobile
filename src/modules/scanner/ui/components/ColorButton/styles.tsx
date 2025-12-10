import { IColors } from '@/UIProvider/theme/IColors';
import { getContrastColor, scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, backgroundColor: string) => {
    const textColor = getContrastColor(backgroundColor);

    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            width: scaleHorizontal(109),
            height: scaleVertical(50),
            backgroundColor,
        },
        activeContainer: {
            borderWidth: 1,
            borderColor: colors.border_strong,
        },
        text: {
            color: textColor,
            textAlign: 'center',
        },
    });
    return styles;
};
