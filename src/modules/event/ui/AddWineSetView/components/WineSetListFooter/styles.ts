import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(16),
            paddingTop: scaleVertical(16),
        },
        divider: {
            height: scaleVertical(1),
            width: '100%',
            backgroundColor: colors.background_light,
        },
        repeatRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        repeatLabel: {
            color: colors.text,
        },
        repeatButton: {
            height: scaleVertical(40),
            borderWidth: scaleHorizontal(1),
            borderColor: colors.primary,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
        },
        repeatButtonText: {
            color: colors.text,
        },
        createButton: {
            marginTop: scaleVertical(8),
        },
    });

    return styles;
};
