import { StyleSheet } from 'react-native';
import { scaleVertical } from '@/utils';

export const getStyles = () => {
    const styles = StyleSheet.create({
        container: {
            marginBottom: scaleVertical(16),
        },
        title: {
            lineHeight: scaleVertical(26),
            marginBottom: scaleVertical(12),
        },
        list: {
            gap: scaleVertical(12),
        },
    });

    return styles;
};
