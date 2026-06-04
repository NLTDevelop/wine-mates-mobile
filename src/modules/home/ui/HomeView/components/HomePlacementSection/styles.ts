import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            position: 'relative',
            paddingLeft: scaleHorizontal(24),
        },
        content: {
            borderRadius: 12,
        },
        removeButton: {
            position: 'absolute',
            top: scaleVertical(34),
            left: scaleHorizontal(14),
            zIndex: 2,
            width: scaleVertical(28),
            height: scaleVertical(28),
            borderRadius: scaleVertical(14),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primary_secondary,
        },
        removeLine: {
            width: scaleHorizontal(12),
            height: scaleVertical(2),
            borderRadius: 1,
            backgroundColor: colors.primary,
        },
        dragIcon: {
            position: 'absolute',
            top: '50%',
            left: scaleHorizontal(1),
            zIndex: 1,
            width: scaleVertical(22),
            height: scaleVertical(22),
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
                {
                    translateY: scaleVertical(-11),
                },
            ],
        },
    });

    return styles;
};
