import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon.tsx';
import { CarouselWineCard } from '@/UIKit/CarouselWineCard';
import { getStyles } from './styles';
import { useWineCarouselCard } from '@/modules/wineAndStyles/ui/components/MyTasteProfileItem/components/WineRecommendationCarousel/presenters/useWineCarouselCard';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';

interface IProps {
    wine: IWineListItem;
    onPrevious: () => void;
    onNext: () => void;
    direction: 'forward' | 'backward';
}

export const WineCarouselCard = ({ wine, onPrevious, onNext, direction }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { handleNextPress, handlePreviousPress } = useWineCarouselCard({
        wineId: wine.id,
        onNext,
        onPrevious,
    });

    return (
        <View style={styles.container}>

            <Animated.View
                key={wine.id}
                entering={direction === 'forward' ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
                exiting={direction === 'forward' ? FadeOutLeft.duration(300) : FadeOutRight.duration(300)}
                style={styles.cardContainer}
            >
                <CarouselWineCard item={wine} />
            </Animated.View>

            <View style={styles.arrowContainer}>
                <TouchableOpacity style={styles.arrowButton} onPress={handlePreviousPress}>
                    <ArrowRightIcon rotate={180} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.arrowButton} onPress={handleNextPress}>
                    <ArrowRightIcon />
                </TouchableOpacity>
            </View>

        </View>
    );
};
