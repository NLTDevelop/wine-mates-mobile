import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            position: 'relative',
        },
        backButton: {
            position: 'absolute',
            top: scaleVertical(16),
            left: scaleHorizontal(16),
            zIndex: 2,
            elevation: 2,
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: scaleVertical(22),
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
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
            zIndex: 1,
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
