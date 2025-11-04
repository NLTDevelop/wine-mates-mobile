import { IColors } from '@/UIProvider/theme/IColors';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { StyleSheet } from 'react-native';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            width: scaleHorizontal(109),
            height: scaleVertical(50),
        },
        activeContainer: {
            borderWidth: 1,
            borderColor: colors.border_strong,
        },
        text: {
            textAlign: 'center',
        },
    });
    return styles;
};
