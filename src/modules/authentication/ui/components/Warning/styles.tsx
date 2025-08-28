import { StyleSheet } from 'react-native';
import { IColors } from '../../../../../UIProvider/theme/IColors';
import { scaleVertical, scaleHorizontal } from '../../../../../utils';

export const getStyles = (colors: IColors) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: scaleHorizontal(7),
            marginTop: scaleVertical(6),
        },
        errorText: {
            color: colors.error,
        },
    });

    return styles;
};
