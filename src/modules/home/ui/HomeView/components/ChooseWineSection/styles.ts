import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(10),
        },
        optionsRow: {
            flexDirection: 'row',
            gap: scaleHorizontal(8),
        },
        option: {
            flex: 1,
            minHeight: scaleVertical(108),
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(10),
            paddingVertical: scaleVertical(12),
            borderRadius: scaleHorizontal(12),
            borderWidth: scaleVertical(1),
            borderColor: colors.border,
            backgroundColor: colors.background,
        },
        optionTitle: {
            marginTop: scaleVertical(8),
            color: colors.primary,
            textAlign: 'center',
        },
        optionDescription: {
            marginTop: scaleVertical(4),
            color: colors.primary,
            textAlign: 'center',
        },
    });

    return styles;
};
