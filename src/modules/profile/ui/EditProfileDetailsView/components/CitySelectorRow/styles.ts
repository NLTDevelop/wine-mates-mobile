import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
            minHeight: scaleVertical(48),
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            paddingHorizontal: scaleHorizontal(16),
            flexDirection: 'row',
            alignItems: 'center',
        },
        value: {
            flex: 1,
            color: colors.text,
        },
        placeholder: {
            flex: 1,
            color: colors.text_light,
        },
    });

    return styles;
};
