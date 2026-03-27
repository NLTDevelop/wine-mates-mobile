import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { useWineRecommendationCarousel } from './presenters/useWineRecommendationCarousel';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { getStyles } from './styles';
import { CarouselWineCard } from '@/UIKit/CarouselWineCard';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon';

interface IProps {
    typeId: number;
    colorId: number;
}

export const WineRecommendationCarousel = observer(({ typeId, colorId }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { wines, currentIndex, onPrevious, onNext, direction, onWinePress } = useWineRecommendationCarousel({
        typeId,
        colorId,
    });

    if (wines.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Animated.View
                key={wines[currentIndex].id}
                entering={direction === 'forward' ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
                exiting={direction === 'forward' ? FadeOutLeft.duration(300) : FadeOutRight.duration(300)}
                style={styles.cardContainer}
            >
                <CarouselWineCard item={wines[currentIndex]} onPress={onWinePress} />
            </Animated.View>

            {
               wines.length > 1 && <>
                    <TouchableOpacity style={[styles.arrowButton, styles.leftArrowContainer]} onPress={onPrevious} activeOpacity={0.6}>
                        <ArrowRightIcon rotate={180} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.arrowButton, styles.rightArrowContainer]} onPress={onNext} activeOpacity={0.6}>
                        <ArrowRightIcon />
                    </TouchableOpacity>
               </>
            }

        </View>
    );
});
