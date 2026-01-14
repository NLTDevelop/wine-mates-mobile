import { memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '../../UIProvider';
import { getStyles } from './styles';
import { TickIcon } from '@assets/icons/TickIcon';

interface IProps {
    isChecked: boolean;
    onPress: () => void;
    isRound?: boolean;
    disabled?: boolean;
}

export const Checkbox = memo(({ isChecked, onPress, isRound, disabled = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, isChecked, disabled, isRound), [colors, isChecked, disabled, isRound]);

    return (
        <TouchableOpacity onPress={onPress} style={styles.container} disabled={disabled}>
            {isChecked ? <TickIcon width={24} height={24} color={colors.text_inverted} /> : null}
        </TouchableOpacity>
    );
});

Checkbox.displayName = 'Checkbox';
