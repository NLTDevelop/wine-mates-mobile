import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.lockBackground,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        },
    });
