import { IColors } from '@/UIProvider/theme/IColors';
import { getContrastColor, scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (_colors: IColors, backgroundColor: string) => {
    const textColor = getContrastColor(backgroundColor);

    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(12),
            justifyContent: 'center',
            minHeight: scaleVertical(40),
            backgroundColor,
        },
        text: {
            color: textColor,
        },
    });
    return styles;
};
