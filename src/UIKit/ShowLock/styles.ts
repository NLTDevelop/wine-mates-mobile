import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (_colors: IColors) =>
    StyleSheet.create({
        container: {
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        },
    });
