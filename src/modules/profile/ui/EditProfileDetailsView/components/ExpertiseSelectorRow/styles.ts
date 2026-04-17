import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(12),
        },
        title: {
            marginBottom: scaleVertical(8),
            color: colors.text,
        },
        row: {
            minHeight: scaleVertical(48),
            borderRadius: scaleVertical(12),
            backgroundColor: colors.background_middle,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(12),
            gap: scaleHorizontal(8),
        },
        value: {
            flex: 1,
            marginLeft: scaleHorizontal(2),
            color: colors.text,
        },
    });

    return styles;
};

