import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleFontSize, scaleHorizontal, scaleVertical } from '../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.background,
            borderRadius: 12,
            paddingHorizontal: scaleVertical(12),
            flexDirection: 'row',
            minHeight: scaleVertical(48),
            alignItems: 'center',
            gap: scaleHorizontal(8),
            borderWidth: 1,
            borderColor: colors.border_light,
        },
        button: {
            height: scaleVertical(20),
            width: scaleVertical(20),
            justifyContent: 'center',
            alignItems: 'center',
        },
        input: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            height: "100%",
            flex: 1,
            color: colors.text,
            fontFamily: 'VisueltPro-Regular',
            fontSize: scaleFontSize(16),
        },
    });
    return styles;
};
