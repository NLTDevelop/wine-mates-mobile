import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        button: {
            height: scaleVertical(24),
            width: scaleVertical(24),
            borderRadius: scaleVertical(24),
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: scaleHorizontal(10),
        },
    });

    return styles;
};
