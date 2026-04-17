import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors, iconSize: number) =>
    StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            width: scaleVertical(iconSize),
            height: scaleVertical(iconSize),
        },
    });
