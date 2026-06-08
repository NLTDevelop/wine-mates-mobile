import { memo, useMemo } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { TickIcon } from '@assets/icons/TickIcon';

interface IProps {
    isChecked: boolean;
    onPress: () => void;
    isRound?: boolean;
    disabled?: boolean;
    containerStyles?: ViewStyle;
    iconSize?: number;
}

export const Checkbox = memo(
    ({ isChecked, onPress, isRound, disabled = false, containerStyles = {}, iconSize = 24 }: IProps) => {
        const { colors } = useUiContext();
        const styles = useMemo(
            () => getStyles(colors, isChecked, disabled, isRound),
            [colors, isChecked, disabled, isRound],
        );

        return (
            <TouchableOpacity onPress={onPress} style={[styles.container, { ...containerStyles }]} disabled={disabled}>
                {isChecked ? <TickIcon width={iconSize} height={iconSize} color={colors.text_inverted} /> : null}
            </TouchableOpacity>
        );
    },
);

Checkbox.displayName = 'Checkbox';
