import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },
        container: {
            flex: 1,
        },
        scroll: {
            flex: 1,
        },
        contentContainerStyle: {
            flexGrow: 1,
        },
    });
    return styles;
};
