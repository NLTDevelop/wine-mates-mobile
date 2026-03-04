import { useMemo, ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EmptyWine } from '@/UIKit/EmptyWine';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { SmallStarRating } from '@/UIKit/SmallStarRating';
import { RateMedal } from '@/modules/scanner/ui/components/RateMedal/ui';
import { ShowLock } from '@/UIKit/ShowLock';
import { EmptyMedal } from '@/UIKit/EmptyMedal';
import { userModel } from '@/entities/users/UserModel';
import { useWineListItem } from './presenters/useWineListItem';
import { getStyles } from './styles';

interface IProps {
    item: IWineListItem;
    onPress?: (item: IWineListItem) => void;
    hideSimilarity?: boolean;
    footer?: ReactNode;
    wineName?: string;
    removeCardStyles?: boolean;
    showDate?: boolean;
    customBottomComponent?: ReactNode;
}

export const WineListItem = ({ item, onPress, hideSimilarity = false, footer, wineName, removeCardStyles = false, showDate = false, customBottomComponent }: IProps) => {
    const { colors, locale } = useUiContext();
    const { styles, medalSize } = useMemo(() => getStyles(colors, removeCardStyles), [colors, removeCardStyles]);
    const { guard, handleItemPress, similarityText, displayRating, reviewCount, lastReviewData, getFormattedDate } = useWineListItem({ item, onPress, showDate });

    const hasPremium = userModel.user?.hasPremium ?? false;
    const showMedal = item.averageExpertRating && item.averageExpertRating > 0;
    console.log(item.name)

    const content = (
        <View style={styles.content}>
            <View style={styles.imageContainer}>
                {!hideSimilarity && (
                    <View style={styles.similarityBadge}>
                        <Typography
                            numberOfLines={1}
                            variant="subtitle_12_400"
                            style={styles.similarityText}
                            text={similarityText}
                        />
                    </View>
                )}
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
                        <RateMedal
                            sliderValue={item.averageExpertRating!}
                            size={medalSize}
                            titleFontSize={24}
                            mainFontSize={90}
                            nameFontSize={26}
                        />
                    ) : (
                        <EmptyMedal size={medalSize} />
                    )}
                </View>

                {hasPremium && (
                    <Typography variant="subtitle_12_400" text={'Expert review'} style={styles.expertReviewText} />
                )}

                {/* {item.producer && (
                    <Typography
                        variant="subtitle_12_400"
                        text={item.producer}
                        numberOfLines={1}
                        style={styles.locationText}
                    />
                )} */}

                <Typography
                    variant="h5"
                    text={wineName || `${item.name || '–'} ${item.vintage || ''}`}
                    style={styles.titleText}
                    {...guard.bindText}
                />

                <View style={styles.rateContainer}>
                    <View style={styles.starsContainer}>
                        <SmallStarRating rating={parseFloat(displayRating) || 0} starSize={12.5} />
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
                            text={`(${reviewCount})`}
                            numberOfLines={1}
                            style={styles.rateReviewText}
                        />
                    )}
                </View>

                <View style={styles.footerContainer}>{footer}</View>
            </View>
        </View>
    );

    const bottomComponent = customBottomComponent || ((showDate && lastReviewData?.createdAt) ? (
        <View style={styles.dateContainer}>
            <Typography
                variant="subtitle_12_400"
                text={getFormattedDate(lastReviewData.createdAt, locale)}
                numberOfLines={1}
                style={styles.locationText}
            />
        </View>
    ) : null);

    if (onPress) {
        return (
            <Pressable
                style={({ pressed }) => [styles.container, pressed && styles.pressed]}
                onPress={handleItemPress}
                onPressOut={guard.bindPressable.onPressOut}
            >
                {content}
                {bottomComponent}
            </Pressable>
        );
    }

    return (
        <View style={styles.container}>
            {content}
            {bottomComponent}
        </View>
    );
};
