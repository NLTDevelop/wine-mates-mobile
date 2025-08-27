import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleVertical } from '../../utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        gradient: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: scaleVertical(319),
        },
    });
    return styles;
};
