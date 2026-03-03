import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            width: '100%',
            gap: scaleVertical(8),
        },
        bottomContainer: {
            marginHorizontal: -scaleHorizontal(12),
            marginVertical: -scaleVertical(12),
            marginTop: scaleVertical(8),
            backgroundColor: colors.error,
        },
        bottomText: {
            color: colors.text_light,
            flexShrink: 0,
        },
    });
    return styles;
};
