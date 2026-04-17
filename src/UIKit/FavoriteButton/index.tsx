import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
import { getStyles } from './styles';

interface IFavoriteButtonProps {
    onPress: () => void;
    size?: number;
    disabled?: boolean;
    isSaved?: boolean;
}

export const FavoriteButton = ({ onPress, size, disabled = false, isSaved = false }: IFavoriteButtonProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size), [colors, size]);

    return (
        <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onPress}
            disabled={disabled}
        >
            <FavoriteIcon isSaved={isSaved} />
        </TouchableOpacity>
    );
};
