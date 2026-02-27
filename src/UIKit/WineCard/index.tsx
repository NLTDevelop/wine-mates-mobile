import { View } from 'react-native';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { Typography } from '@/UIKit/Typography';
import { EmptyWine } from '@/UIKit/EmptyWine';
import { RateMedal } from '@/modules/scanner/ui/components/RateMedal/ui';
import { ShowLock } from '@/UIKit/ShowLock';
import { EmptyMedal } from '@/UIKit/EmptyMedal';
import { SmallStarRating } from '@/UIKit/SmallStarRating';
import { ICarouselWineCardData } from './types';
import { useCarouselWineCard } from './useCarouselWineCard';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useMemo } from 'react';

interface IProps {
    item: ICarouselWineCardData;
}

export const CarouselWineCard = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const { styles, medalSize } = useMemo(() => getStyles(colors), [colors]);
    const { hasPremium, displayRating, ratingCount, showMedal } = useCarouselWineCard({ item });

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <View style={styles.imagePlaceholderContainer}>
                        <EmptyWine containerStyle={styles.imagePlaceholder} />
                    </View>
                    {item.image?.originalUrl && (
                        <FasterImageView
                            source={{ uri: item.image.originalUrl, resizeMode: 'cover' }}
                            style={styles.image}
                            radius={12}
                        />
                    )}
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.medalContainer}>
                        {!hasPremium ? (
                            <ShowLock iconSize={medalSize} />
                        ) : showMedal ? (
                            <View>
                                <RateMedal sliderValue={item.averageExpertRating!} size={medalSize} />
                                <Typography variant="subtitle_12_400" text={item.averageExpertRating!.toFixed(1)} />
                            </View>
                        ) : (
                            <EmptyMedal size={medalSize} />
                        )}
                    </View>

                    {hasPremium && (
                        <Typography variant="subtitle_12_400" text={'Expert review'} style={styles.expertReviewText} />
                    )}

                    <Typography
                        variant="h5"
                        text={`${item.name || '–'} ${item.vintage || ''}`}
                        numberOfLines={2}
                        style={styles.titleText}
                    />

                    {item.producer && (
                        <Typography
                            variant="subtitle_12_400"
                            text={item.producer}
                            numberOfLines={1}
                            style={styles.locationText}
                        />
                    )}

                    <View style={styles.rateContainer}>
                        <View style={styles.starsContainer}>
                            <SmallStarRating
                                rating={parseFloat(displayRating) || 0}
                                starSize={12.5}
                            />
                            <Typography
                                variant="subtitle_12_500"
                                text={displayRating}
                                numberOfLines={1}
                                style={styles.rateText}
                            />
                        </View>
                        {!!item.totalReviews && (
                            <Typography
                                variant="subtitle_12_400"
                                text={`(${ratingCount})`}
                                numberOfLines={1}
                                style={styles.rateReviewText}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};
