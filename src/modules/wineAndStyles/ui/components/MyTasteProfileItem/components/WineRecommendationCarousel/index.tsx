import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useWineRecommendationCarousel } from './useWineRecommendationCarousel';
import { WineCarouselCard } from './components/WineCarouselCard';

export const WineRecommendationCarousel = observer(() => {
    const { styles, mockWines, currentIndex, handlePrevious, handleNext, direction } = useWineRecommendationCarousel();

    if (mockWines.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <WineCarouselCard
                wine={mockWines[currentIndex]}
                onPrevious={handlePrevious}
                onNext={handleNext}
                direction={direction}
            />
        </View>
    );
});
