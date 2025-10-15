import { StyleSheet } from 'react-native';
import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.background_middle,
            borderRadius: 12,
            paddingVertical: scaleVertical(4),
            paddingRight: scaleHorizontal(12),
            paddingLeft: scaleVertical(4),
        },
    });
    return styles;
};
