import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors, backgroundColor: string) => {
    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(12),
            justifyContent: 'center',
            minHeight: scaleVertical(40),
            backgroundColor,
        },
        text: {
            color: colors.text_inverted,
            maxWidth: scaleHorizontal(300),
            flexShrink: 1,
        }
    });
    return styles;
};
