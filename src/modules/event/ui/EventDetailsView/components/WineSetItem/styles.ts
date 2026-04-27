import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: scaleHorizontal(8),
        },
        leftContent: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: scaleHorizontal(8),
        },
        image: {
            width: scaleVertical(32),
            height: scaleVertical(32),
            borderRadius: 8,
            backgroundColor: colors.background_light,
        },
        title: {
            color: colors.text,
            flex: 1,
        },
    });

    return styles;
};
