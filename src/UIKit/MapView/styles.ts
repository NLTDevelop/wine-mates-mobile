import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (_colors: IColors) => {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            overflow: 'hidden',
        },
        map: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    });

    return styles;
};
