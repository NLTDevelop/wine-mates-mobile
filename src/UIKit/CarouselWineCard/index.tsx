import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { Avatar } from '@/UIKit/Avatar';
import { WineListItem } from '@/UIKit/WineListItem';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { useMemo } from 'react';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

interface IProps {
    item: IWineListItem;
    onPress?: (item: IWineListItem) => void;
}

export const CarouselWineCard = ({ item, onPress }: IProps) => {
    const { colors } = useUiContext();
    const { styles } = useMemo(() => getStyles(colors), [colors]);

    return (
        <WineListItem
            item={item}
            onPress={onPress}
            removeCardStyles={true}
            footer={
                item.lastReview && item.lastReview.review ? (
                    <View style={styles.reviewSection}>
                        <View style={styles.userRow}>
                            <Avatar
                                avatarUrl={item.lastReview.user.image?.originalUrl || null}
                                fullname={`${item.lastReview.user.firstName} ${item.lastReview.user.lastName}`}
                                size={24}
                            />
                            <Typography
                                variant="body_400"
                                text={`${item.lastReview.user.firstName} ${item.lastReview.user.lastName}`}
                                numberOfLines={1}
                            />
                        </View>
                        <Typography
                            variant="body_400"
                            text={item.lastReview.review}
                            numberOfLines={3}
                            style={styles.text}
                        />
                    </View>
                ) : null
            }
        />
    );
};
