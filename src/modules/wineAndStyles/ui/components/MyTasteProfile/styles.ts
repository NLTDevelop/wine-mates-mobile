import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            gap: scaleVertical(16),
            marginHorizontal: scaleHorizontal(16),
        },
        list: {
            marginBottom: scaleVertical(16),
        },
        containerStyle: {
            paddingBottom: scaleVertical(16),
            paddingHorizontal: scaleHorizontal(16),
            gap: scaleVertical(16),
            flexGrow: 1,
        },
    });
    return styles;
};
