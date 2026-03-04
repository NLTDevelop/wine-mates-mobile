import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        list: {
            marginBottom: scaleVertical(24),
        },
        contentContainerStyle: {
            paddingBottom: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            flexGrow: 1,
            gap: scaleVertical(24),
        },
    });
    return styles;
};
