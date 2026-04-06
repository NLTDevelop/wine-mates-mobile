import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: scaleHorizontal(16),
        },
        list: {
            marginTop: scaleVertical(16),
        },
        separator: {
            height: scaleVertical(16),
        },
        loaderContainer: {
            paddingVertical: scaleVertical(24),
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
    return styles;
};
