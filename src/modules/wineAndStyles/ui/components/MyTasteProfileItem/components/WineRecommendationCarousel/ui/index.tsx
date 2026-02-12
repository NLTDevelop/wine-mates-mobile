import { useMemo } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { useWineRecommendationCarousel } from '../presenters/useWineRecommendationCarousel';
import { WineCarouselCard } from '../components/WineCarouselCard/ui';
import { getStyles } from './styles';

export const WineRecommendationCarousel = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { wines, currentIndex, handlePrevious, handleNext, direction, isLoading } = useWineRecommendationCarousel();

    if (isLoading || wines.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <WineCarouselCard
                wine={wines[currentIndex]}
                onPrevious={handlePrevious}
                onNext={handleNext}
                direction={direction}
            />
        </View>
    );
});
