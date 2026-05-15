import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
        },
        label: {
            color: colors.text,
            marginBottom: scaleVertical(8),
        },
        intervalRow: {
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: scaleHorizontal(8),
        },
        intervalLabel: {
            flex: 1,
            color: colors.text,
        },
        intervalDropdown: {
            width: scaleHorizontal(70),
            height: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(12),
        },
        frequencyDropdown: {
            width: scaleHorizontal(136),
            height: scaleVertical(48),
            paddingHorizontal: scaleHorizontal(12),
        },
    });

    return styles;
};
