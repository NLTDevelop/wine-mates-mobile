import { useCallback, useMemo } from 'react';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { IEvent } from '@/entities/events/types/IEvent';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { EventCard } from '@/UIKit/EventCard';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon';
import { getStyles } from './styles';
import { useHomeEventSection } from './presenters/useHomeEventSection';
import Carousel from 'react-native-reanimated-carousel';
import { scaleHorizontal } from '@/utils';
import { CarouselDots } from '../CarouselDots';

interface IProps {
    title: string;
    events: IEvent[];
}

export const HomeEventSection = ({ title, events }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { width } = useWindowDimensions();
    const {
        carouselRef,
        activeIndex,
        carouselHeight,
        onProgressChange,
        onCardLayout,
        onArrowPress,
        onReadMorePress,
        onFavoritePress,
        onEditPress,
        onConfigurePanGesture,
    } = useHomeEventSection(events);
    const carouselWidth = width - scaleHorizontal(32);

    const renderItem = useCallback(({ item }: { item: IEvent }) => {
        return (
            <View onLayout={onCardLayout} style={styles.cardContainer}>
                <EventCard
                    event={item}
                    isSelected={false}
                    onReadMorePress={onReadMorePress}
                    onFavoritePress={onFavoritePress}
                    onEditPress={onEditPress}
                />
            </View>
        );
    }, [onCardLayout, onEditPress, onFavoritePress, onReadMorePress, styles]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h3" text={title} />
                <TouchableOpacity onPress={onArrowPress} style={styles.arrowButton} hitSlop={8}>
                    <ArrowRightIcon />
                </TouchableOpacity>
            </View>
            <Carousel
                ref={carouselRef}
                loop={false}
                width={carouselWidth}
                height={carouselHeight}
                data={events}
                onProgressChange={onProgressChange}
                renderItem={renderItem}
                onConfigurePanGesture={onConfigurePanGesture}
            />
            <CarouselDots count={events.length} activeIndex={activeIndex} />
        </View>
    );
};
