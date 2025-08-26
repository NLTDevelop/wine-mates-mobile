import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleFontSize, scaleLineHeight } from '../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            borderLeftWidth: 0,
            height: 'auto',
            shadowOpacity: 0,
            elevation: 0,
            borderRadius: 8,
        },
        content: {
            backgroundColor: colors.success,
            borderRadius: 8,
            paddingVertical: 10,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        text: {
            fontSize: scaleFontSize(14),
            lineHeight: scaleLineHeight(20),
            fontFamily: 'VisueltPro-Medium',
            fontWeight: '600',
            color: colors.text_inverted,
            textAlign: 'center',
        },
    });
    return styles;
};
