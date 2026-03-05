import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        headerContainer: {
            zIndex: 1000,
        },
        content: {
            flex: 1,
        },
    });
    return styles;
};
