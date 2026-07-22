import { StyleSheet } from 'react-native';
import { scaleVertical } from '@/utils';

export const getStyles = () => {
    const styles = StyleSheet.create({
        container: {
            paddingTop: scaleVertical(8),
        },
        list: {
            gap: scaleVertical(4),
        },
    });

    return styles;
};
