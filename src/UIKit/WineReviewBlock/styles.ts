import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            gap: scaleVertical(8),
            borderWidth: scaleHorizontal(1),
            borderRadius: 8,
            borderColor: colors.border,
            padding: scaleHorizontal(8),
        },
        userRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(8),
        },
        reviewText: {
            color: colors.text_light,
        },
    });
    return styles;
}
