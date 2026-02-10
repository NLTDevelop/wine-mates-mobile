import { Pressable, View } from 'react-native';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { FasterImageView } from '@rraut/react-native-faster-image';
import { StarIcon } from '@assets/icons/StartIcon';
import { declOfWord } from '@/utils';
import { Avatar } from '@/UIKit/Avatar';
import { useWineListItem } from './useWineListItem';

interface IProps {
    item: IWineListItem;
    onPress: (item: IWineListItem) => void;
    hideSimilarity?: boolean;
    showDate?: boolean;
}

export const WineListItem = ({ item, onPress, hideSimilarity = false, showDate = false }: IProps) => {
    const { t, colors } = useUiContext();
    const { styles, guard, handleItemPress, similarityText, displayRating, lastReviewData, formattedDate } = useWineListItem({ item, onPress, hideSimilarity, showDate });

    return (
        <Pressable
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
            onPress={handleItemPress}
            onPressOut={guard.bindPressable.onPressOut}
        >
            <View style={styles.content}>
                {!hideSimilarity && (
                    <View style={styles.similarityContainer}>
                        <Typography numberOfLines={1} variant="subtitle_12_400" style={styles.similarityText} text={similarityText} />
                    </View>
                )}
                <View pointerEvents="none">
                    {item.image?.originalUrl ? (
                        <FasterImageView
                            source={{ uri: item.image?.originalUrl, resizeMode: 'cover' }}
                            style={styles.image}
                            radius={12}
                        />
                    ) : (
                        <View style={[styles.image, styles.imagePlaceholder]} />
                    )}
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.subContainer}>
                        <Typography
                            variant="h6"
                            text={`${item.name} ${item.vintage}`}
                            numberOfLines={2}
                            {...guard.bindText}
                        />
                        <View style={styles.rateContainer}>
                            <StarIcon />
                            <Typography variant="subtitle_12_500" text={displayRating} />
                            <Typography
                                variant="subtitle_12_400"
                                text={`(${declOfWord(
                                    item.countUserRating || item.countExpertRating || 0,
                                    t('scanner.reviewCount') as unknown as Array<string>,
                                )})`}
                                style={styles.text}
                            />
                        </View>
                    </View>
                    {lastReviewData && (
                        <View style={styles.subContainer}>
                            <View style={styles.userRow}>
                                <Avatar
                                    avatarUrl={lastReviewData.user.image?.originalUrl || null}
                                    fullname={`${lastReviewData.user.firstName} ${lastReviewData.user.lastName}`}
                                    size={24}
                                />
                                <Typography
                                    text={`${lastReviewData.user.firstName} ${lastReviewData.user.lastName}`}
                                    {...guard.bindText}
                                />
                            </View>
                            <Typography
                                variant="body_400"
                                text={lastReviewData.review ?? '-'}
                                numberOfLines={3}
                                style={styles.text}
                            />
                            {/*{showDate && formattedDate && (*/}
                            {/*    <Typography*/}
                            {/*        variant="body_400"*/}
                            {/*        text={formattedDate}*/}
                            {/*        style={styles.dateText}*/}
                            {/*    />*/}
                            {/*)}*/}
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
};
