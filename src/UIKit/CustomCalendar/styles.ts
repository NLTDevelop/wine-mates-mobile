import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleHorizontal } from '../../utils';

export const getStyles = (colors: IColors) => {
    return StyleSheet.create({
        wrapper: {
            position: 'relative',
        },
        calendar: {
            borderRadius: 8,
            marginHorizontal: scaleHorizontal(16),
            backgroundColor: colors.background_strong,
        },
        loader: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
};
