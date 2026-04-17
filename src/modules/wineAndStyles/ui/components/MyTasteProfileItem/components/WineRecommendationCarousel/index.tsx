import { useMemo } from 'react';
import { View, useWindowDimensions, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { useWineRecommendationCarousel } from './presenters/useWineRecommendationCarousel';
import Carousel from 'react-native-reanimated-carousel';
import { getStyles } from './styles';
import { CarouselWineCard } from '@/UIKit/CarouselWineCard';
import { scaleHorizontal } from '@/utils';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon';

interface IProps {
    typeId: number;
    colorId: number;
}

export const WineRecommendationCarousel = observer(({ typeId, colorId }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { width } = useWindowDimensions();
    const { wines, carouselRef, onSnapToItem, onWinePress, onNext, onPrevious } = useWineRecommendationCarousel({
        typeId,
        colorId,
    });

    if (wines.length === 0) {
        return null;
    }

    const carouselWidth = width - scaleHorizontal(48);

    return (
        <View style={styles.container}>
            <Carousel
                ref={carouselRef}
                loop={false}
                width={carouselWidth}
                height={styles.carouselHeight.height}
                data={wines}
                onSnapToItem={onSnapToItem}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <CarouselWineCard item={item} onPress={onWinePress} />
                    </View>
                )}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
            />

            {wines.length > 1 && (
                <>
                    <TouchableOpacity
                        style={[styles.arrowButton, styles.leftArrowContainer]}
                        onPress={onPrevious}
                        activeOpacity={0.6}
                    >
                        <ArrowRightIcon rotate={180} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.arrowButton, styles.rightArrowContainer]}
                        onPress={onNext}
                        activeOpacity={0.6}
                    >
                        <ArrowRightIcon />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
});
