import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        backdrop: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(16),
        },
        card: {
            width: '100%',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            backgroundColor: colors.background,
            paddingHorizontal: scaleHorizontal(16),
            paddingVertical: scaleVertical(16),
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            color: colors.text,
            flex: 1,
            textAlign: 'center',
            paddingLeft: scaleHorizontal(24),
        },
        closeButton: {
            width: scaleHorizontal(24),
            height: scaleHorizontal(24),
            justifyContent: 'center',
            alignItems: 'center',
        },
        subtitle: {
            marginTop: scaleVertical(4),
            color: colors.text_light,
            textAlign: 'center',
        },
        iconContainer: {
            marginTop: scaleVertical(16),
            alignItems: 'center',
        },
        checkButton: {
            marginTop: scaleVertical(16),
            marginBottom: scaleVertical(8),
        },
    });

    return styles;
};
