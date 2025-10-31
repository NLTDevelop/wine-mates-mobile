import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        listLoader: {
            marginVertical: scaleVertical(16),
        },
    });
    return styles;
};
