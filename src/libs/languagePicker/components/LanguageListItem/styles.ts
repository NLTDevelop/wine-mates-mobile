import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        leftContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(12),
            flex: 1,
        },
        flag: {
            width: scaleVertical(20),
            height: scaleVertical(20),
            borderRadius: scaleVertical(20),
        },
        name: {
            color: colors.text,
            flexShrink: 1,
        },
        code: {
            color: colors.text_light,
            textTransform: 'uppercase',
        },
        placeholderFlag: {
            width: scaleVertical(20),
            height: scaleVertical(20),
            borderRadius: scaleVertical(20),
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
        },
        placeholderText: {
            color: colors.text,
        },
    });

    return styles;
};
