import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { EditIcon } from '@assets/icons/EditIcon';

interface IProps {
    onPress: () => void;
    size?: number;
    disabled?: boolean;
}

export const EditButton = ({ onPress, size, disabled = false, }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size), [colors, size]);

    return (
        <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onPress}
            disabled={disabled}
        >
            <EditIcon />
        </TouchableOpacity>
    );
};
