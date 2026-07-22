import { StyleSheet } from 'react-native';

export const getStyles = () => {
    const styles = StyleSheet.create({
        container: {
            alignSelf: 'flex-start',
        },
        fillOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
        },
        fillContent: {
            alignItems: 'flex-start',
        },
    });

    return styles;
};
