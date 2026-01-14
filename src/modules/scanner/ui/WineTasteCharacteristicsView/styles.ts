import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        list: {
            maxHeight: scaleVertical(500),
            marginBottom: scaleVertical(16),
        },
        contentContainer: {
            flexGrow: 1,
            rowGap: scaleVertical(10),
            paddingBottom: scaleVertical(16),
        },
        selectedParameters: {
            marginHorizontal: scaleHorizontal(16),
        },
        button: {
            marginHorizontal: scaleHorizontal(16),
            marginBottom: scaleVertical(16),
        },
    });
    return styles;
};
