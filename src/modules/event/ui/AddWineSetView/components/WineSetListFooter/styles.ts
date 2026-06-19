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
