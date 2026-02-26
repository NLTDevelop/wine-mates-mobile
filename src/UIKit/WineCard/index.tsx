import { View } from 'react-native';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { Typography } from '@/UIKit/Typography';
import { StarIcon } from '@assets/icons/StartIcon';
import { Avatar } from '@/UIKit/Avatar';
import { EmptyWine } from '@/UIKit/EmptyWine';
import { RateMedal } from '@/modules/scanner/ui/components/RateMedal/ui';
import { LockIcon } from '@assets/icons/LockIcon';
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
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { hasPremium, displayRating, ratingCount, lastReviewData, showMedal, medalLabel } = useCarouselWineCard({ item });

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {item.image?.originalUrl ? (
                    <FasterImageView
                        source={{ uri: item.image.originalUrl, resizeMode: 'cover' }}
                        style={styles.image}
                        radius={12}
                    />
                ) : (
                    <EmptyWine containerStyle={styles.image} />
                )}
            </View>

            <View style={styles.rightColumn}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Typography variant="h4" text={`${item.name || '–'} ${item.vintage || '–'}`} numberOfLines={2} />
                        <View style={styles.rateContainer}>
                            <View style={styles.rateWrapper}>
                                <StarIcon />
                                <Typography variant="subtitle_12_500" text={displayRating} />
                                <Typography variant="subtitle_12_400" text={`(${ratingCount})`} style={styles.text} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        {showMedal && hasPremium && item.averageExpertRating ? (
                            <View style={styles.medalContainer}>
                                <RateMedal sliderValue={item.averageExpertRating} size={18} />
                                <Typography variant="subtitle_12_400" text={medalLabel} style={styles.medalText} numberOfLines={2} />
                            </View>
                        ) : (
                            <View style={styles.lockedMedalContainer}>
                                <LockIcon />
                            </View>
                        )}
                    </View>
                </View>

                {lastReviewData && (
                    <View style={styles.reviewSection}>
                        <View style={styles.userRow}>
                            <Avatar
                                avatarUrl={lastReviewData.user.image?.originalUrl || null}
                                fullname={`${lastReviewData.user.firstName} ${lastReviewData.user.lastName}`}
                                size={24}
                            />
                            <Typography
                                variant="body_400"
                                text={`${lastReviewData.user.firstName} ${lastReviewData.user.lastName}`}
                                numberOfLines={1}
                            />
                        </View>
                        <Typography
                            variant="body_400"
                            text={lastReviewData.review ?? '-'}
                            numberOfLines={3}
                            style={styles.text}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};
