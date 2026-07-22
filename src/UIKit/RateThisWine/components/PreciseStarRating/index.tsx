import { ComponentProps, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { usePreciseStarRating } from './presenters/usePreciseStarRating';
import { getStyles } from './styles';

type StarIconComponent = NonNullable<ComponentProps<typeof StarRatingDisplay>['StarIconComponent']>;

interface IProps {
    rating: number;
    onChange?: (rating: number) => void;
    StarIconComponent: StarIconComponent;
    starSize: number;
    starStyle?: StyleProp<ViewStyle>;
    color?: string;
    emptyColor: string;
    maxStars?: number;
    step?: number;
}

export const PreciseStarRating = ({
    rating,
    onChange,
    StarIconComponent,
    starSize,
    starStyle,
    color,
    emptyColor,
    maxStars = 5,
    step = 0.1,
}: IProps) => {
    const styles = useMemo(() => getStyles(), []);
    const {
        gesture,
        fillOverlayStyle,
        fillContentStyle,
        completionStyle,
        onLayout,
    } = usePreciseStarRating({ rating, maxStars, step, onChange });

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                collapsable={false}
                style={[styles.container, completionStyle]}
                onLayout={onLayout}
            >
                <StarRatingDisplay
                    rating={0}
                    maxStars={maxStars}
                    step="full"
                    StarIconComponent={StarIconComponent}
                    starSize={starSize}
                    starStyle={starStyle}
                    emptyColor={emptyColor}
                />
                <Animated.View
                    pointerEvents="none"
                    style={[styles.fillOverlay, fillOverlayStyle]}
                >
                    <Animated.View style={[styles.fillContent, fillContentStyle]}>
                        <StarRatingDisplay
                            rating={maxStars}
                            maxStars={maxStars}
                            step="full"
                            StarIconComponent={StarIconComponent}
                            starSize={starSize}
                            starStyle={starStyle}
                            color={color}
                        />
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </GestureDetector>
    );
};
