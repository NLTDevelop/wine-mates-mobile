import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        dateBadge: {
            width: scaleHorizontal(56),
            height: scaleHorizontal(56),
            backgroundColor: colors.text,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        monthText: {
            color: colors.background,
            fontSize: scaleFontSize(14),
        },
        dayContainer: {
            flex: 1,
            width: '100%',
            backgroundColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dayText: {
            color: colors.text,
        },
    });
    return styles;
};
