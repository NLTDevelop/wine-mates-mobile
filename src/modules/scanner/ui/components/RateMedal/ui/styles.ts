import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors.ts';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        }
    });
    return styles;
};
