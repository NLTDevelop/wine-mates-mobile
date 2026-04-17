import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
        title: {
            marginBottom: scaleVertical(24),
        },
        content: {
            minHeight: scaleVertical(200),
            justifyContent: 'center',
            alignItems: 'center',
        },
        placeholder: {
            color: colors.text_middle,
            textAlign: 'center',
        },
        footer: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
            marginTop: scaleVertical(24),
        },
        button: {
            flex: 1,
        },
    });

    return styles;
};
