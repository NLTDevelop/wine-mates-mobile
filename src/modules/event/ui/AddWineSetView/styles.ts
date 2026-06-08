import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        screen: {
            flex: 1,
        },
        scroll: {
            flex: 1,
        },
        container: {
            paddingHorizontal: scaleHorizontal(16),
            paddingBottom: scaleVertical(24),
        },
    });

    return styles;
};
