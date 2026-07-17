import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            position: 'relative',
        },
        button: {
            width: scaleHorizontal(80),
            height: scaleVertical(76),
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: colors.background_light,
        },
        image: {
            width: '100%',
            height: '100%',
        },
        deleteButton: {
            position: 'absolute',
            top: scaleVertical(2),
            right: scaleHorizontal(2),
            width: scaleHorizontal(22),
            height: scaleVertical(22),
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        },
    });

    return styles;
};
