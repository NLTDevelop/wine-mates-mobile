import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        subtitle: {
            marginTop: scaleVertical(4),
            color: colors.text_light,
            textAlign: 'center',
        },
        qrCodeContainer: {
            marginTop: scaleVertical(16),
            alignItems: 'center',
            padding: scaleHorizontal(12),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.border,
            borderRadius: 12,
            alignSelf: 'center',
            backgroundColor: colors.background,
        },
        checkButton: {
            marginTop: scaleVertical(16),
            marginBottom: scaleVertical(8),
        },
    });

    return styles;
};
