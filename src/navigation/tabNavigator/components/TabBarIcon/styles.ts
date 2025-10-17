import { StyleSheet } from 'react-native';
import { IColors } from '../../../../UIProvider/theme/IColors';
import { scaleVertical } from '../../../../utils';

export const getStyle = (_colors: IColors) => {
    const styles = StyleSheet.create({
        animation: {
            width: scaleVertical(24),
            height: scaleVertical(24),
        },
    });
    return styles;
};
