import { useCallback, useMemo, ReactNode } from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EmptyWine } from '@/UIKit/EmptyWine';
import { SmallStarRating } from '@/UIKit/SmallStarRating';
import { RateMedal } from '@/UIKit/RateMedal/ui';
import { ShowLock } from '@/UIKit/ShowLock';
import { useWineListItem } from './presenters/useWineListItem';
import { getStyles, WINE_LIST_ITEM_MEDAL_SIZE } from './styles';
import { useWineDescription } from './presenters/useWineDescription';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { ShareIcon } from '@assets/icons/ShareIcon';

interface IProps {
    item: IWineListItem | IWineDetails;
    onPress?: (item: IWineListItem) => void;
    onSharePress?: (item: IWineListItem | IWineDetails) => void;
    showSimilarity?: boolean;
    footer?: ReactNode;
    removeCardStyles?: boolean;
    showDate?: boolean;
    showVintage?: boolean;
    showNonVintage?: boolean;
    customBottomComponent?: ReactNode;
    showExpertRatingWithoutPremium?: boolean;
    isMyWine?: boolean;
    hideDate?: boolean;
    alignFooterToBottom?: boolean;
}

export const WineListItem = ({ item, onPress, onSharePress, showSimilarity = false, footer, removeCardStyles = false,
    showDate = false, showVintage = false, showNonVintage = false, isMyWine = false, customBottomComponent,
    showExpertRatingWithoutPremium = false, hideDate = false, alignFooterToBottom = false }: IProps) => {
    const { colors, locale, t } = useUiContext();
    const styles = useMemo(
        () => getStyles(colors, removeCardStyles, alignFooterToBottom),
        [alignFooterToBottom, colors, removeCardStyles],
    );
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
        showMedal, 
        showUserReviewCount,
        showExpertReviewCount,
        expertReviewLabel,
        onPressShareButton,
        onWineryPress,
        isWineryLink,
    } = useWineListItem({ item, onPress, onSharePress, removeCardStyles, isMyWine });
    const { description } = useWineDescription({ item, showVintage, showNonVintage });
    const getContainerStyle = useCallback(
        ({ pressed }: { pressed: boolean }) => [styles.container, pressed && styles.pressed],
        [styles.container, styles.pressed],
    );
    return (
        <Pressable
            style={getContainerStyle}
            onPress={onItemPress}
            disabled={!onPress}
        >
            <TouchableOpacity style={styles.shareButton} onPress={onPressShareButton} hitSlop={12}>
                <ShareIcon width={20} height={20} color={colors.text} />
            </TouchableOpacity>
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
                    <View style={styles.detailsContainer}>
                        <View style={styles.medalContainer}>
                            {!hasPremium && showMedal && !showExpertRatingWithoutPremium ? (
                                <ShowLock iconSize={WINE_LIST_ITEM_MEDAL_SIZE} />
                            ) : showMedal ? (
                                <RateMedal
                                    sliderValue={expertRating ?? 0}
                                    size={WINE_LIST_ITEM_MEDAL_SIZE}
                                    titleFontSize={24}
                                    mainFontSize={90}
                                    nameFontSize={26}
                                />
                            ) : null}
                        </View>

                        {showMedal ? (
                            <>
                                <Typography variant="subtitle_10_400" text={expertReviewLabel} />
                                {expertReviewCount && showExpertReviewCount ? (
                                    <Typography
                                        variant="subtitle_10_400"
                                        text={`(${expertReviewCount})`}
                                        numberOfLines={1}
                                    />
                                ) : null}
                            </>
                        ) : null}

                        {item.producer ? (
                            <TouchableOpacity
                                onPress={onWineryPress}
                                disabled={!isWineryLink}
                                activeOpacity={0.8}
                            >
                                <Typography
                                    variant="h5"
                                    text={item.producer}
                                    style={isWineryLink ? styles.wineryTitleText : styles.titleText}
                                />
                            </TouchableOpacity>
                        ) : null}

                        <Typography variant="subtitle_10_400" text={description || `-`} style={styles.descriptionText} />

                        {userRating !== null ? (
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
                                {showUserReviewCount && (
                                    <Typography
                                        variant="subtitle_10_400"
                                        text={`(${userReviewCount})`}
                                        numberOfLines={1}
                                        style={styles.rateReviewText}
                                    />
                                )}
                            </View>
                        ) : (
                            <View style={styles.emptyDivider} />
                        )}
                    </View>

                    <View style={styles.footerContainer}>{footer}</View>
                </View>
            </View>
            {customBottomComponent ||
                (!hideDate && (showDate || shouldReviewShow) && lastReviewData?.createdAt ? (
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
