import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            paddingHorizontal: scaleHorizontal(16),
        },
        list: {
            marginBottom: scaleVertical(16),
        },
        contentContainer: {
            flexGrow: 1,
            rowGap: scaleVertical(7),
        },
        button: {
            marginBottom: scaleVertical(16),
        },
    });
    return styles;
};
