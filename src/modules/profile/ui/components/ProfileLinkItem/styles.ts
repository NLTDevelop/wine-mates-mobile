import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(16),
            borderWidth: scaleHorizontal(1),
            borderRadius: 12,
            borderColor: colors.border,
            backgroundColor: colors.background,
            gap: scaleHorizontal(12),
        },
        infoContainer: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
        },
        title: {
            flex: 1,
            color: colors.text,
        },
    });

    return styles;
};
