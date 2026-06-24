import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, topInset: number) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            position: 'relative',
        },
        headerContainer: {
            position: 'absolute',
            top: topInset,
            left: 0,
            right: 0,
            zIndex: 2,
        },
        headerRightPlaceholder: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
        },
        map: {
            flex: 1,
        },
        footer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
            gap: scaleVertical(12),
            borderTopWidth: scaleHorizontal(1),
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: 'absolute',
            zIndex: 1,
            bottom: 0,
            width: '100%',
            paddingBottom: scaleVertical(32),
        },
        addressText: {
            color: colors.text_light,
            fontSize: 14,
            lineHeight: 20,
        },
    });
    return styles;
};
