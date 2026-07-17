import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        title: {
            textAlign: 'center',
            marginBottom: scaleVertical(8),
        },
        message: {
            textAlign: 'center',
            marginBottom: scaleVertical(16),
        },
        buttons: {
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        button: {
            flex: 1,
        },
    });

    return styles;
};
