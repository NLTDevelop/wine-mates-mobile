import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            borderRadius: 12,
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            minHeight: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(12),
            gap: scaleHorizontal(12),
        },
        leftContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            flex: 1,
        },
        rightContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        flag: {
            width: scaleVertical(20),
            height: scaleVertical(20),
            borderRadius: scaleVertical(20),
        },
        placeholderText: {
            color: colors.text_light,
        },
        languageText: {
            color: colors.text,
            flexShrink: 1,
        },
        code: {
            color: colors.text_light,
            textTransform: 'uppercase',
        },
    });

    return styles;
};
