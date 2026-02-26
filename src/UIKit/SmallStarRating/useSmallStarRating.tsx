import { useMemo } from 'react';
import { View } from 'react-native';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { EmptyStarIcon } from '@assets/icons/EmptyStarIcon';
import { IColors } from '@/UIProvider/theme/IColors';
import { getStyles } from './styles';

interface IProps {
    rating: number;
    starSize: number;
    maxStars: number;
    colors: IColors;
}

interface IStar {
    type: 'full' | 'half' | 'empty' | 'fraction';
    fill: number;
}

const getStars = (rating: number, maxStars: number): IStar[] => {
    const stars: IStar[] = [];
    const clampedRating = Math.max(0, Math.min(rating, maxStars));

    for (let i = 0; i < maxStars; i++) {
        const starValue = clampedRating - i;
        
        if (starValue >= 1) {
            stars.push({ type: 'full', fill: 1 });
        } else if (starValue > 0) {
            stars.push({ type: 'fraction', fill: starValue });
        } else {
            stars.push({ type: 'empty', fill: 0 });
        }
    }

    return stars;
};

export const useSmallStarRating = ({ rating, starSize, maxStars, colors }: IProps) => {
    const styles = useMemo(() => getStyles(colors), [colors]);

    const stars = useMemo(() => {
        const starData = getStars(rating, maxStars);

        return starData.map((star, index) => {
            if (star.fill <= 0) {
                return (
                    <View key={index} style={styles.star}>
                        <EmptyStarIcon width={starSize} height={starSize} color={colors.icon} />
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
                    <View style={[styles.starIconContainer, { width: starSize, height: starSize }]}>
                        <EmptyStarIcon width={starSize} height={starSize} color={colors.icon} />
                        <View
                            style={[
                                styles.starFillOverlay,
                                {
                                    width: starSize * star.fill,
                                    height: starSize,
                                },
                            ]}
                        >
                            <FilledStarIcon width={starSize} height={starSize} color={colors.stars} />
                        </View>
                    </View>
                </View>
            );
        });
    }, [rating, maxStars, starSize, colors, styles]);

    return { stars };
};
