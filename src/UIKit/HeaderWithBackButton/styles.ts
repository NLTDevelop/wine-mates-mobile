import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleFontSize, scaleLineHeight, scaleVertical } from '../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            width: '100%',
            height: scaleVertical(56),
            justifyContent: 'center',
            alignItems: 'center',
        },
        button: {
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        titleContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: scaleFontSize(18),
            lineHeight: scaleLineHeight(24),
            fontWeight: '600',
            fontFamily: 'Roboto-Regular',
            color: colors.text_strong,
        },
        empty: {
            width: 50,
            height: 50,
        },
    });
    return styles;
};
