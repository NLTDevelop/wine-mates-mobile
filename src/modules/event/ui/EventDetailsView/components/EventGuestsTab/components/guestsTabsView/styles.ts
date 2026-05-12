import { StyleSheet } from 'react-native';

export const getStyles = () => {
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return styles;
};
