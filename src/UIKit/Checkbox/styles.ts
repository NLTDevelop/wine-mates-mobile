import { StyleSheet } from 'react-native';
import { IColors } from '../../UIProvider/theme/IColors';
import { scaleVertical } from '../../utils';

export const getStyles = (colors: IColors, isChecked: boolean, disabled?: boolean, isRound?: boolean) => {
    const styles = StyleSheet.create({
        container: {
            width: scaleVertical(24),
            height: scaleVertical(24),
            borderRadius: isRound ? scaleVertical(24) : 6,
            backgroundColor:
                isChecked && disabled ? colors.border_light : isChecked ? colors.primary : colors.background,
            borderWidth: 2,
            borderColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
    return styles;
};
