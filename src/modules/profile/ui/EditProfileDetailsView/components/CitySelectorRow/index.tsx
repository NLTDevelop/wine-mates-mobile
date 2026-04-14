import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';

interface IProps {
    value: string;
    placeholder: string;
    disabled: boolean;
    onPress: () => void;
}

export const CitySelectorRow = ({ value, placeholder, disabled, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} disabled={disabled}>
            <Typography text={value || placeholder} variant="h6" style={value ? styles.value : styles.placeholder} numberOfLines={1} />
            <ArrowDownIcon />
        </TouchableOpacity>
    );
};
