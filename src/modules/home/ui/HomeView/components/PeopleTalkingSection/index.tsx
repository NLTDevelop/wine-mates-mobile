import { useCallback, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CommentIcon } from '@assets/icons/CommentIcon';
import { LikeIcon } from '@assets/icons/LikeIcon';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon';
import { Avatar } from '@/UIKit/Avatar';
import { IHomePeopleTalking } from '../../types/IHomeVisibleSection';
import { getStyles } from './styles';
import Carousel from 'react-native-reanimated-carousel';
import { scaleHorizontal } from '@/utils';
import { usePeopleTalkingSection } from './presenters/usePeopleTalkingSection';
import { CarouselDots } from '../CarouselDots';

interface IProps {
    title: string;
    data: IHomePeopleTalking[];
    carouselHorizontalOffset?: number;
}

export const PeopleTalkingSection = ({
    title,
    data,
    carouselHorizontalOffset = 32,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { width } = useWindowDimensions();
    const {
        carouselRef,
        activeIndex,
        carouselHeight,
        hasItems,
        onProgressChange,
        onCardLayout,
        onConfigurePanGesture,
    } = usePeopleTalkingSection(data);
    const carouselWidth = width - scaleHorizontal(carouselHorizontalOffset);

    const renderItem = useCallback(({ item }: { item: IHomePeopleTalking }) => {
        return (
            <View onLayout={onCardLayout} style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <View style={styles.authorRow}>
                            <Avatar size={40} avatarUrl={item.authorAvatar} fullname={item.authorName} />
                            <Typography variant="h5" text={item.authorName} style={styles.authorName} />
                        </View>
                        <Typography variant="body_400" text={item.createdAtLabel} style={styles.createdAt} />
                    </View>
                    <Typography variant="body_400" text={item.text} style={styles.text} numberOfLines={2}/>
                    <View style={styles.statsRow}>
                        {item.hasLikes && (
                            <View style={styles.stat}>
                                <LikeIcon width={20} height={20} color={colors.text} />
                                <Typography variant="body_400" text={item.likesCount} />
                            </View>
                        )}
                        {item.hasComments && (
                            <View style={styles.stat}>
                                <CommentIcon width={20} height={20} color={colors.text} />
                                <Typography variant="body_400" text={item.commentsCount} />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    }, [colors.text, onCardLayout, styles]);

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Typography variant="h3" text={title} />
                <View style={styles.arrowButton}>
                    <ArrowRightIcon />
                </View>
            </View>
            {hasItems ? (
                <>
                    <Carousel
                        ref={carouselRef}
                        loop={false}
                        width={carouselWidth}
                        height={carouselHeight}
                        data={data}
                        onProgressChange={onProgressChange}
                        renderItem={renderItem}
                        onConfigurePanGesture={onConfigurePanGesture}
                    />
                    <CarouselDots count={data.length} activeIndex={activeIndex} />
                </>
            ) : (
                <View style={styles.emptyContainer}>
                    <Typography
                        variant="body_400"
                        text={t('home.peopleTalkingEmptyDescription')}
                        style={styles.emptyText}
                    />
                </View>
            )}
        </View>
    );
};
