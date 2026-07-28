import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        list: {
            gap: scaleVertical(16),
            paddingBottom: scaleVertical(20),
        },
    });

    return styles;
};
