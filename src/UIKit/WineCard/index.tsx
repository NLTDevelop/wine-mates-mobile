import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { Avatar } from '@/UIKit/Avatar';
import { WineListItem } from '@/UIKit/WineListItem';
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
    const { lastReviewData } = useCarouselWineCard({ item });

    const footer = lastReviewData ? (
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
    ) : null;

    return (
        <WineListItem
            item={item}
            hideSimilarity={true}
            removeCardStyles={true}
            footer={footer}
        />
    );
};
