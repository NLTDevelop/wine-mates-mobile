import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors, top: number) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
            position: 'relative',
        },
        header: {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            top: top + scaleVertical(16),
            left: scaleHorizontal(16),
            zIndex: 1,
        },
        closeButton: {
            width: scaleHorizontal(40),
            height: scaleHorizontal(40),
            alignItems: 'center',
            justifyContent: 'center',
        },
        map: {
            flex: 1,
        },
        footer: {
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
            gap: scaleVertical(12),
            borderTopWidth: 1,
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
        coordinates: {
            textAlign: 'center',
            color: colors.text_light,
        },
    });
    return styles;
};
