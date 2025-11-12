import { IColors } from '@/UIProvider/theme/IColors';
import { StyleSheet } from 'react-native';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex:1,
            justifyContent: 'center',
            alignItems: 'center'
        },
    });
    return styles;
};
