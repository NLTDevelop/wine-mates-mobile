import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors.ts';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, size: number) => {
    const styles = StyleSheet.create({
        container: {
            width: size,
            height: size,
            borderRadius: size / 2,
            position: 'relative',
            overflow: 'hidden',
        },
        image: {
            width: size,
            height: size,
            borderRadius: size / 2,
        },
        placeholder: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
        },
        initials: {
            color: colors.text,
        },
        deleteBadge: {
            position: 'absolute',
            bottom: scaleVertical(-4),
            right: scaleHorizontal(-2),
            width: size * 0.35,
            height: size * 0.35,
            borderRadius: (size * 0.35) / 2,
            backgroundColor: colors.error,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.background,
        },
    });

    return styles;
};
