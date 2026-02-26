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
import { useWineListItem } from './useWineListItem';
import { getStyles } from './styles';

interface IProps {
    item: IWineListItem;
    onPress?: (item: IWineListItem) => void;
    hideSimilarity?: boolean;
    footer?: ReactNode;
    wineName?: string;
    removeCardStyles?: boolean;
}

export const WineListItem = ({ item, onPress, hideSimilarity = false, footer, wineName, removeCardStyles = false }: IProps) => {
    const { colors } = useUiContext();
    const { styles, medalSize } = useMemo(() => getStyles(colors, removeCardStyles), [colors, removeCardStyles]);
    const { guard, handleItemPress, similarityText, displayRating, reviewCount, locationText } = useWineListItem({ item, onPress });

    const hasPremium = userModel.user?.hasPremium ?? false;
    const showMedal = item.averageExpertRating && item.averageExpertRating > 0;

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            onPress={handleItemPress}
            onPressOut={guard.bindPressable.onPressOut}
        >
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    {!hideSimilarity && (
                        <View style={styles.similarityBadge}>
                            <Typography numberOfLines={1} variant="subtitle_12_400" style={styles.similarityText} text={similarityText} />
                        </View>
                    )}
                    {item.image?.originalUrl ? (
                        <FasterImageView
                            source={{ uri: item.image.originalUrl, resizeMode: 'cover' }}
                            style={styles.image}
                            radius={12}
                        />
                    ) : (
                        <View style={styles.image}>
                            <EmptyWine containerStyle={styles.imagePlaceholder} />
                        </View>
                    )}
                </View>

                <View style={styles.rightColumn}>
                    <View style={styles.medalContainer}>
                        {!hasPremium ? (
                            <ShowLock iconSize={medalSize} />
                        ) : showMedal ? (
                            <RateMedal sliderValue={item.averageExpertRating!} size={medalSize} />
                        ) : (
                            <EmptyMedal size={medalSize} />
                        )}
                    </View>

                    <Typography
                        variant="h5"
                        text={wineName || `${item.name || '–'} ${item.vintage || ''}`}
                        numberOfLines={2}
                        style={styles.titleText}
                        {...guard.bindText}
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
                                text={`(${reviewCount})`}
                                numberOfLines={1}
                                style={styles.rateReviewText}
                            />
                        )}
                    </View>

                    <View style={styles.footerContainer}>
                        {footer}
                    </View>
                </View>
            </View>
        </Pressable>
    );
};
