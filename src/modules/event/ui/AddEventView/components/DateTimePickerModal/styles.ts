import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            gap: scaleVertical(16),
        },
        confirmButton: {
            width: '100%',
        },
    });
    return styles;
};
