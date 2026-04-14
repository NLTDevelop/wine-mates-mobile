import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        listContainer: {
            paddingVertical: scaleVertical(16),
            paddingHorizontal: scaleVertical(16),
            gap: scaleVertical(12),
        },
    });
    return styles;
};
