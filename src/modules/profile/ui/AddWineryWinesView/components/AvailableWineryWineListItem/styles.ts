import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            padding: scaleVertical(12),
            backgroundColor: colors.background,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
        },
        imageContainer: {
            width: scaleHorizontal(88),
            height: scaleVertical(132),
            overflow: 'hidden',
            borderRadius: 12,
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            gap: scaleVertical(6),
        },
        title: {
            color: colors.text,
        },
        secondaryText: {
            color: colors.text_light,
        },
    });

    return styles;
};
