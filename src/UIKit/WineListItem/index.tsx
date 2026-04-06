import { useMemo, ReactNode } from 'react';
import { Image, Pressable, View } from 'react-native';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EmptyWine } from '@/UIKit/EmptyWine';
import { SmallStarRating } from '@/UIKit/SmallStarRating';
import { RateMedal } from '@/modules/scanner/ui/components/RateMedal/ui';
import { ShowLock } from '@/UIKit/ShowLock';
import { useWineListItem } from './presenters/useWineListItem';
import { getStyles } from './styles';
import { useWineDescription } from './presenters/useWineDescription';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';

interface IProps {
    item: IWineListItem | IWineDetails;
    onPress?: (item: IWineListItem) => void;
    showSimilarity?: boolean;
    footer?: ReactNode;
    removeCardStyles?: boolean;
    showDate?: boolean;
    customBottomComponent?: ReactNode;
}

export const WineListItem = ({ item, onPress, showSimilarity = false, footer, removeCardStyles = false,
    showDate = false, customBottomComponent }: IProps) => {
    const { colors, locale, t } = useUiContext();
    const { styles, medalSize } = useMemo(() => getStyles(colors, removeCardStyles), [colors, removeCardStyles]);
    const { 
        onItemPress, 
        similarityText, 
        userRating, 
        userReviewCount, 
        expertReviewCount, 
        lastReviewData, 
        getFormattedDate,
        hasPremium,
        shouldReviewShow,
        expertRating,
        showMedal
    } = useWineListItem({ item, onPress, removeCardStyles });
    const { description } = useWineDescription({ item });

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            onPress={onItemPress}
            disabled={!onPress}
        >
            <View style={styles.content}>
                <View style={styles.imageContainer} pointerEvents="none">
                    {showSimilarity && (
                        <View style={styles.similarityBadgeContainer}>
                            <View style={styles.similarityBadge}>
                                <Typography
                                    numberOfLines={1}
                                    variant="subtitle_12_400"
                                    style={styles.similarityText}
                                    text={`${t('wine.similarity')} ${similarityText}`}
                                />
                            </View>
                        </View>
                    )}

                    {item.image?.originalUrl || item.defaultImage?.originalUrl ? (
                        <Image
                            source={{ uri: item.image?.originalUrl || item.defaultImage?.originalUrl }}
                            style={styles.image}
                        />
                    ) : (
                        <View style={styles.imagePlaceholderContainer}>
                            <EmptyWine containerStyle={styles.imagePlaceholder} />
                        </View>
                    )}
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.medalContainer}>
                        {!hasPremium && showMedal && !shouldReviewShow ? (
                            <ShowLock iconSize={medalSize} />
                        ) : showMedal ? (
                            <RateMedal
                                sliderValue={expertRating}
                                size={medalSize}
                                titleFontSize={24}
                                mainFontSize={90}
                                nameFontSize={26}
                            />
                        ) : null}
                    </View>

                    {showMedal ? (
                        <>
                            <Typography
                                variant="subtitle_10_400"
                                text={t('wine.expertReview')}
                            />
                            {expertReviewCount ? (
                                <Typography
                                    variant="subtitle_10_400"
                                    text={`(${expertReviewCount})`}
                                    numberOfLines={1}
                                />
                            ) : null}
                        </>
                    ) : null}

                    {item.producer ? <Typography variant="h5" text={item.producer} style={styles.titleText} /> : null}

                    <Typography
                        variant="subtitle_10_400"
                        text={description || `-`}
                        style={styles.descriptionText}
                    />

                    <View style={styles.rateContainer}>
                        <View style={styles.starsContainer}>
                            <SmallStarRating rating={parseFloat(userRating) || 0} starSize={12.5} />
                            <Typography
                                variant="subtitle_12_500"
                                text={userRating}
                                numberOfLines={1}
                                style={styles.rateText}
                            />
                        </View>
                        <Typography
                            variant="subtitle_10_400"
                            text={`(${userReviewCount})`}
                            numberOfLines={1}
                            style={styles.rateReviewText}
                        />
                    </View>

                    <View style={styles.footerContainer}>{footer}</View>
                </View>
            </View>
            {customBottomComponent ||
                ((showDate || shouldReviewShow) && lastReviewData?.createdAt ? (
                    <View style={styles.dateContainer}>
                        <Typography
                            variant="subtitle_12_400"
                            text={getFormattedDate(lastReviewData.createdAt, locale)}
                            numberOfLines={1}
                            style={styles.locationText}
                        />
                    </View>
                ) : null)}
        </Pressable>
    );
};
