import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { EmptyStarIcon } from '@assets/icons/EmptyStarIcon';
import { scaleVertical } from '@/utils';

interface IProps {
    rating: number;
    starSize?: number;
    maxStars?: number;
}

interface IStar {
    fill: number;
}

const getStars = (rating: number, maxStars: number): IStar[] => {
    const stars: IStar[] = [];
    const clampedRating = Math.max(0, Math.min(rating, maxStars));

    for (let i = 0; i < maxStars; i++) {
        const starValue = clampedRating - i;

        if (starValue >= 1) {
            stars.push({ fill: 1 });
        } else if (starValue > 0) {
            stars.push({ fill: starValue });
        } else {
            stars.push({ fill: 0 });
        }
    }

    return stars;
};

export const SmallStarRating = ({ rating, starSize = 16, maxStars = 5 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const emptyStarColor = rating <= 0 ? colors.border : colors.icon;
    const actualStarSize = scaleVertical(starSize);
    
    const stars = useMemo(() => {
        return getStars(rating, maxStars).map((star, index) => {
            if (star.fill <= 0) {
                return (
                    <View key={index} style={styles.star}>
                        <EmptyStarIcon width={starSize} height={starSize} color={emptyStarColor} />
                    </View>
                );
            }

            if (star.fill >= 1) {
                return (
                    <View key={index} style={styles.star}>
                        <FilledStarIcon width={starSize} height={starSize} color={colors.stars} />
                    </View>
                );
            }

            return (
                <View key={index} style={styles.star}>
                    <View style={[styles.starIconContainer, { width: actualStarSize, height: actualStarSize }]}>
                        <View
                            style={[
                                styles.starFillOverlay,
                                {
                                    width: actualStarSize * star.fill,
                                    height: actualStarSize,
                                },
                            ]}
                        >
                            <FilledStarIcon width={starSize} height={starSize} color={colors.stars} />
                        </View>
                        <EmptyStarIcon width={starSize} height={starSize} color={emptyStarColor} />
                    </View>
                </View>
            );
        });
    }, [rating, maxStars, starSize, colors.stars, emptyStarColor, styles, actualStarSize]);

    return (
        <View style={styles.container}>
            {stars}
        </View>
    );
};
