import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyle = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            overflow: 'hidden',
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: 100,
            backgroundColor: colors.background_grey,
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatar: {
            width: scaleVertical(40),
            height: scaleVertical(40),
            borderRadius: 50,
        },
    });
    return styles;
}
