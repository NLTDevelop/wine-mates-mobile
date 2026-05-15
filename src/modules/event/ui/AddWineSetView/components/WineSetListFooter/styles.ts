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
            borderColor: colors.border,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: scaleHorizontal(12),
            backgroundColor: colors.background,
            justifyContent: 'space-between',
        },
        repeatButtonText: {
            color: colors.text_middle,
            flex: 1,
        },
        switchInnerCircle: {
            width: scaleHorizontal(22),
            height: scaleVertical(18),
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
        },
        createButton: {
            marginTop: scaleVertical(8),
        },
    });

    return styles;
};
