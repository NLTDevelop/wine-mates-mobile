import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            minHeight: scaleVertical(56),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            paddingHorizontal: scaleHorizontal(16),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background,
            gap: scaleHorizontal(12),
        },
        leftContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        title: {
            flex: 1,
            color: colors.text,
        },
        flag: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderRadius: scaleVertical(24),
        },
        placeholderFlag: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderRadius: scaleVertical(24),
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
        },
        placeholderText: {
            color: colors.text,
        },
    });

    return styles;
};
