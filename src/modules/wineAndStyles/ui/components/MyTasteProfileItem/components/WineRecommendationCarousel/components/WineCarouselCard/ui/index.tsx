import { useMemo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { Typography } from '@/UIKit/Typography';
import { EmptyWine } from '@/UIKit/EmptyWine';
import { useUiContext } from '@/UIProvider';
import { ArrowRightIcon } from '@assets/icons/ArrowRightIcon.tsx';
import { StarIcon } from '@assets/icons/StartIcon.tsx';
import { LocationPinIcon } from '@assets/icons/LocationPinIcon.tsx';
import { IRecommendationWineItem } from '@/entities/wine/types/IRecommendationWineList';
import { getStyles } from './styles';

interface IProps {
    wine: IRecommendationWineItem;
    onPrevious: () => void;
    onNext: () => void;
    direction: 'forward' | 'backward';
}

export const WineCarouselCard = ({ wine, onPrevious, onNext, direction }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.arrowButton} onPress={onPrevious}>
                <ArrowRightIcon rotate={180} />
            </TouchableOpacity>

            <Animated.View
                key={wine.id}
                entering={direction === 'forward' ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
                exiting={direction === 'forward' ? FadeOutLeft.duration(300) : FadeOutRight.duration(300)}
                style={styles.cardContainer}
            >
                <View style={styles.imageContainer}>
                    <View style={styles.imageWrapper}>
                        {wine.image?.mediumUrl ? (
                            <Image source={{ uri: wine.image.mediumUrl }} style={styles.wineImage} resizeMode="contain" />
                        ) : (
                            <EmptyWine />
                        )}
                    </View>
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity style={styles.iconButton}></TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <StarIcon />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.locationBadge}>
                        <LocationPinIcon />
                        <Typography 
                            text={wine.region?.name || wine.country?.name || wine.producer} 
                            variant="subtitle_12_400" 
                            style={styles.locationText} 
                        />
                    </View>

                    <Typography 
                        numberOfLines={2} 
                        text={`${wine.name}${wine.vintage ? ` ${wine.vintage}` : ''}`} 
                        variant="h6" 
                        style={styles.wineName} 
                    />
                    <Typography 
                        text={wine.grapeVariety || wine.type.name} 
                        variant="subtitle_12_400" 
                        style={styles.wineType} 
                    />

                    <View style={styles.ratingContainer}>
                        <StarIcon />
                        <Typography
                            text={`${wine.averageUserRating || 0}`}
                            variant="subtitle_12_400"
                            style={styles.ratingText}
                        />
                        <Typography
                            text={`(${wine.countUserRating || 0} reviews)`}
                            variant="subtitle_12_400"
                            style={styles.ratingCountText}
                        />
                    </View>
                </View>
            </Animated.View>

            <TouchableOpacity style={styles.arrowButton} onPress={onNext}>
                <ArrowRightIcon />
            </TouchableOpacity>
        </View>
    );
};
