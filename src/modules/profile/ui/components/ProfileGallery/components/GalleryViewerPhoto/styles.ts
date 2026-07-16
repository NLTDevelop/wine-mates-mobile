import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        image: {
            width: '100%',
            height: '100%',
        },
    });

    return styles;
};
