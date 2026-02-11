import { View, TouchableOpacity, Image } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { Typography } from '@/UIKit/Typography';
import { useWineCarouselCard } from './useWineCarouselCard';
import { NextArrowIcon } from '@assets/icons/NextArrowIcon.tsx';
import {ArrowDownIcon} from '@assets/icons/ArrowDownIcon.tsx';
import { StarIcon } from '@assets/icons/StartIcon.tsx';

interface IWine {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    location: string;
    rating: number;
    reviewsCount: number;
}

interface IProps {
    wine: IWine;
    onPrevious: () => void;
    onNext: () => void;
    direction: 'forward' | 'backward';
}

export const WineCarouselCard = ({ wine, onPrevious, onNext, direction }: IProps) => {
    const { styles } = useWineCarouselCard();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.arrowButton} onPress={onPrevious}>
                <ArrowDownIcon rotate={90} />
            </TouchableOpacity>

            <Animated.View
                key={wine.id}
                entering={direction === 'forward' ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
                exiting={direction === 'forward' ? FadeOutLeft.duration(300) : FadeOutRight.duration(300)}
                style={styles.cardContainer}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: wine.imageUrl }} style={styles.wineImage} resizeMode="contain" />
                    <View style={styles.iconsContainer}>
                        <TouchableOpacity style={styles.iconButton}></TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <StarIcon />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.locationBadge}>
                        <Typography text={wine.location} variant="body_500" style={styles.locationText} />
                    </View>

                    <Typography text={wine.name} variant="h6" style={styles.wineName} />
                    <Typography text={wine.type} variant="subtitle_12_400" style={styles.wineType} />

                    <View style={styles.ratingContainer}>
                        <StarIcon />
                        <Typography
                            text={`${wine.rating} (${wine.reviewsCount} reviews)`}
                            variant="body_500"
                            style={styles.ratingText}
                        />
                    </View>
                </View>
            </Animated.View>

            <TouchableOpacity style={styles.arrowButton} onPress={onNext}>
                <ArrowDownIcon rotate={-90} />
            </TouchableOpacity>
        </View>
    );
};
