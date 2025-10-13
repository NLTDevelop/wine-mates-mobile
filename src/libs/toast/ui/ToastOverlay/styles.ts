import { StyleSheet } from 'react-native';
import { IColors } from '../../../../UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '../../../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        successContainer: {
            width: scaleHorizontal(343),
            paddingVertical: scaleVertical(12),
            paddingHorizontal: scaleHorizontal(16),
            borderRadius: 8,
            backgroundColor: colors.success,
            alignItems: 'center',
            flexDirection: 'row',
            gap: scaleHorizontal(12),
        },
        textContainer: {
            flex: 1,
            flexShrink: 1,
        },
        text: {
            flexShrink: 1,
        },
    });
    return styles;
};
