import { IColors } from '@/UIProvider/theme/IColors';
import { scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        card: {
            height: scaleVertical(50),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
        },
        countText: {
            color: colors.text_light,
        },
    });
    return styles;
};
