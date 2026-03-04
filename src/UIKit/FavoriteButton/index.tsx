import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
import { getStyles } from './styles';

interface IFavoriteButtonProps {
    onPress: () => void;
    size?: number;
}

export const FavoriteButton = ({ onPress, size }: IFavoriteButtonProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, size), [colors, size]);

    return (
        <TouchableOpacity style={styles.favoriteButton} onPress={onPress}>
            <FavoriteIcon />
        </TouchableOpacity>
    );
};
