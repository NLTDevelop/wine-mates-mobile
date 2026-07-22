import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        message: {
            textAlign: 'center',
        },
        buttons: {
            gap: scaleVertical(8),
        },
    });

    return styles;
};
