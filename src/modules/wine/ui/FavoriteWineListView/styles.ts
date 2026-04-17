import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        containerStyle: {
            paddingVertical: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
        },
        separator: {
            height: scaleVertical(16),
        },
    });

    return styles;
};
