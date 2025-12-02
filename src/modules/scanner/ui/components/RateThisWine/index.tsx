import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Slider } from '@/UIKit/Slider';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { EmptyStarIcon } from '@assets/icons/EmptyStarIcon';
import { HalfStarIcon } from '@assets/icons/HalfStarIcon';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';

interface IProps {
    sliderValue: number;
    handleSliderChange?: (value: number) => void;
    starRate: number;
    onStarRateChange?: (value: number) => void;
    disabled?: boolean;
}

interface StarIconProps {
    type: "full" | "half" | "empty" | "quarter" | "three-quarter";
    size: number;
    color: string;
}

const StarIcon = ({ type, size, color }: StarIconProps) => {
    if (type === "full") {
      return <FilledStarIcon width={size} height={size} color={color} />;
    }
  
    if (type === "half") {
      return <HalfStarIcon width={size} height={size} color={color} outlineColor={color} />;
    }
  
    return <EmptyStarIcon width={size} height={size} color={color} />;
  };

export const RateThisWine = ({ sliderValue, handleSliderChange, starRate, onStarRateChange, disabled = false}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={t('wine.rateThisWine')} variant="subtitle_20_500" style={styles.title} />
            {userModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER ? (
                <>
                    <Slider
                        min={0}
                        max={100}
                        value={sliderValue}
                        onChange={handleSliderChange ?? (() => {})}
                        selectedColor={colors.selectedSlider}
                        containerStyle={styles.sliderContainer}
                        disabled={disabled}
                    />
                    <View style={styles.row}>
                        <Typography text={sliderValue.toString()} />
                    </View>
                </>
            ) : (
                disabled ? (
                    <StarRatingDisplay
                        rating={starRate}
                        StarIconComponent={StarIcon}
                        starSize={36}
                        starStyle={styles.star}
                        emptyColor={colors.icon}
                    />
                ) : (
                    <StarRating
                        rating={starRate}
                        onChange={onStarRateChange ?? (() => {})}
                        StarIconComponent={StarIcon}
                        starSize={36}
                        starStyle={styles.star}
                        emptyColor={colors.icon}
                    />
                )
            )}
        </View>
    );
};
