import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (_colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            position: 'relative',
        },
        content: {
            flex: 1,
            paddingBottom: scaleVertical(96),
            paddingRight: scaleHorizontal(5),
        },
        scrollArea: {
            flex: 1,
            width: '100%',
            paddingRight: scaleHorizontal(10),
            overflow: 'visible',
        },
        list: {
            flex: 1,
            width: '100%',
        },
        contentContainer: {
            flexGrow: 1,
            rowGap: scaleVertical(10),
        },
        selectedParameters: {
            paddingLeft: scaleHorizontal(16),
        },
        button: {
            marginHorizontal: 0,
            marginBottom: 0,
        },
        buttonContainer: {
            position: 'absolute',
            left: scaleHorizontal(16),
            right: scaleHorizontal(16),
            bottom: scaleVertical(16),
            zIndex: 2,
        },
        indicator: {
            width: scaleHorizontal(6),
            backgroundColor: _colors.primary,
        },
    });
    return styles;
};
