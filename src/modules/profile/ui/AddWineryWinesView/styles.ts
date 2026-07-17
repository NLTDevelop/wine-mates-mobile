import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        list: {
            flex: 1,
        },
        contentContainer: {
            flexGrow: 1,
            gap: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(16),
            paddingTop: scaleVertical(16),
            paddingBottom: scaleVertical(24),
        },
    });

    return styles;
};
