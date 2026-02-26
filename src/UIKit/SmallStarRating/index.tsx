import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useSmallStarRating } from './useSmallStarRating';

interface IProps {
    rating: number;
    starSize?: number;
    maxStars?: number;
}

export const SmallStarRating = ({ rating, starSize = 16, maxStars = 5 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { stars } = useSmallStarRating({ rating, starSize, maxStars, colors });

    return (
        <View style={styles.container}>
            {stars}
        </View>
    );
};
