import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
            marginBottom: scaleVertical(8),
        },
        message: {
            textAlign: 'center',
            marginBottom: scaleVertical(16),
        },
        buttonsContainer: {
            flexDirection: 'row',
            gap: scaleVertical(12),
        },
        button: {
            flex: 1,
        },
    });

    return styles;
};
