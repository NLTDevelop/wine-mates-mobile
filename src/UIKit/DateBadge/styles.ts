import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        dateBadge: {
            width: scaleVertical(48),
            height: scaleVertical(48),
            borderRadius: 8,
            overflow: 'hidden',
        },
        monthContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.text,
        },
        monthText: {
            color: colors.background,
        },
        dayContainer: {
            height: scaleVertical(30),
            width: '100%',
            backgroundColor: colors.background_middle,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dayText: {
            color: colors.text,
        },
    });
    return styles;
};
