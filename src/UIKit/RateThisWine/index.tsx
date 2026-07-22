import { useMemo } from 'react';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { PartitionedSlider } from '@/UIKit/RateThisWine/components/PartitionedSlider';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { useRateThisWine } from './presenters/useRateThisWine';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { RateMedal } from '../RateMedal/ui';
import { PreciseStarRating } from './components/PreciseStarRating';

interface IProps {
    sliderValue: number;
    handleSliderChange?: (value: number) => void;
    starRate: number;
    onStarRateChange?: (value: number) => void;
    disabled?: boolean;
    hasChangedRating?: boolean;
    isFullTastingReview?: boolean;
    ratingSliderKey?: number;
    ratingStarsKey?: number;
}

const EXPERT_RATING_PARTS: [number, number][] = [
    [70, 76],
    [76, 81],
    [81, 86],
    [86, 91],
    [91, 97],
    [97, 100],
];
const PRECISE_STAR_STEP = 0.1 as unknown as 'quarter';

export const RateThisWine = ({ sliderValue, handleSliderChange, starRate, onStarRateChange, disabled = false, hasChangedRating = false, isFullTastingReview, ratingSliderKey, ratingStarsKey }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        StarIconComponent,
        decorators,
        title,
        currentRatingDescription,
        debouncedSliderValue,
    } = useRateThisWine(disabled, starRate, sliderValue, hasChangedRating, isFullTastingReview);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Typography text={title} variant="subtitle_20_500" style={styles.title} />
                {!disabled && userModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && (
                    <RateMedal
                        sliderValue={debouncedSliderValue}
                        titleFontSize={24}
                        mainFontSize={90}
                        nameFontSize={26}
                    />
                )}
            </View>
            {userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER && currentRatingDescription && (
                <View style={styles.ratingDescriptionContainer}>
                    <View style={styles.ratingDescriptionRow}>
                        <FilledStarIcon width={16} height={16} color={colors.stars} />
                        <Typography
                            text={`${starRate.toFixed(1)} ${currentRatingDescription}`}
                            variant="body_400"
                            style={styles.ratingDescription}
                        />
                    </View>
                </View>
            )}

            {userModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER ? (
                disabled ? (
                    <RateMedal
                        sliderValue={debouncedSliderValue}
                        titleFontSize={24}
                        mainFontSize={90}
                        nameFontSize={26}
                    />
                ) : (
                    <>
                        <PartitionedSlider
                            key={ratingSliderKey}
                            parts={EXPERT_RATING_PARTS}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            selectedStyle={{ backgroundColor: colors.selectedSlider }}
                            containerStyle={styles.sliderContainer}
                            disabled={false}
                            decorator={decorators}
                        />
                        <View style={styles.row}>
                            <Typography text={sliderValue.toString()} />
                        </View>
                    </>
                )
            ) : disabled ? (
                <View style={styles.starsContainer}>
                    <StarRatingDisplay
                        key={ratingStarsKey}
                        rating={starRate}
                        step={PRECISE_STAR_STEP}
                        StarIconComponent={StarIconComponent}
                        starSize={36}
                        starStyle={styles.star}
                        emptyColor={colors.icon}
                    />
                </View>
            ) : (
                <View style={styles.starsContainer}>
                    <PreciseStarRating
                        key={ratingStarsKey}
                        rating={starRate}
                        onChange={onStarRateChange}
                        StarIconComponent={StarIconComponent}
                        starSize={36}
                        starStyle={styles.star}
                        color={colors.stars}
                        emptyColor={colors.icon}
                    />
                </View>
            )}
        </View>
    );
};
