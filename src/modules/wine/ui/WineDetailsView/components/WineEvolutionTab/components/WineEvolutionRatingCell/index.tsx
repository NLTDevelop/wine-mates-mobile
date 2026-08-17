import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { IWineEvolutionRating } from '@/modules/wine/types/IWineEvolution';
import { getStyles } from './styles';

interface IProps {
    rating: IWineEvolutionRating;
}

export const WineEvolutionRatingCell = ({ rating }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.ratingCell}>
            {rating.score === null ? (
                <Typography text="-" variant="subtitle_12_400" style={styles.ratingValue} />
            ) : (
                <>
                    <View style={styles.ratingValueRow}>
                        <Typography text={rating.scoreText} variant="subtitle_12_400" style={styles.ratingValue} />
                        <FilledStarIcon width={16} height={16} color={colors.stars} />
                    </View>
                    <Typography text={rating.reviewsText} variant="subtitle_12_400" style={styles.ratingReviews} />
                </>
            )}
        </View>
    );
};
