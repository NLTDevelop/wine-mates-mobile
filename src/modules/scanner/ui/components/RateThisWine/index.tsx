import { useMemo } from 'react';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { PartitionedSlider } from '@/UIKit/PartitionedSlider';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { RateMedal } from '../RateMedal/ui';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { useRateThisWine } from './presenters/useRateThisWine';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    sliderValue: number;
    handleSliderChange?: (value: number) => void;
    starRate: number;
    onStarRateChange?: (value: number) => void;
    disabled?: boolean;
}

export const RateThisWine = ({ sliderValue, handleSliderChange, starRate, onStarRateChange, disabled = false }: IProps) => {
    const { colors } = useUiContext();
    const { styles } = useMemo(() => getStyles(colors), [colors]);

    const {
        StarIconComponent,
        decorators,
        title,
        currentRatingDescription,
    } = useRateThisWine(disabled, starRate);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Typography text={title} variant="subtitle_20_500" style={styles.title} />
                {!disabled && userModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER && <RateMedal sliderValue={sliderValue} size={32} />}
            </View>
            {!disabled && userModel.user?.wineExperienceLevel === WineExperienceLevelEnum.LOVER && currentRatingDescription && (
                <View style={styles.ratingDescriptionContainer}>
                    <View style={styles.ratingDescriptionRow}>
                        <FilledStarIcon width={16} height={16} color={colors.stars} />
                        <Typography text={`${starRate.toFixed(1)} ${currentRatingDescription}`} variant="body_400" style={styles.ratingDescription} />
                    </View>
                </View>
            )}

            {userModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER ? (
                disabled ? (
                    <RateMedal sliderValue={sliderValue}/>
                ) : (
                    <>
                        <PartitionedSlider
                            parts={[[70, 75], [76, 80], [81, 85], [86, 90], [91, 96], [97, 100]]}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            selectedStyle={{ backgroundColor: colors.selectedSlider }}
                            containerStyle={styles.sliderContainer}
                            disabled={false}
                            decorator={decorators}
                            partTrackColors={['default', 'default', '#B87333', '#DADDE1', '#E6C35C', '#E8E9EB']}
                        />
                        <View style={styles.row}>
                            <Typography text={sliderValue.toString()} />
                        </View>
                    </>
                )
            ) : disabled ? (
                <View style={styles.starsContainer}>
                    <StarRatingDisplay
                        rating={starRate}
                        step={0.1}
                        StarIconComponent={StarIconComponent}
                        starSize={36}
                        starStyle={styles.star}
                        emptyColor={colors.icon}
                    />
                </View>
            ) : (
                <View style={styles.starsContainer}>
                    <StarRating
                        rating={starRate}
                        onChange={onStarRateChange ?? (() => {})}
                        step={0.1}
                        StarIconComponent={StarIconComponent}
                        starSize={36}
                        starStyle={styles.star}
                        emptyColor={colors.icon}
                    />
                </View>
            )}
        </View>
    );
};
