import { useMemo } from 'react';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { RateMedal } from '../RateMedal/ui';
import { Tooltip } from '@/UIKit/Tooltip';
import { InfoIcon } from '@assets/icons/InfoIcon.tsx';
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
        tooltipIconSize,
        tooltipIconColor,
        StarIconComponent,
        tooltipContent,
        decorators,
        title,
    } = useRateThisWine(disabled);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Typography text={title} variant="subtitle_20_500" style={styles.title} />
                <View style={styles.tooltipContainer}>
                    <Tooltip content={tooltipContent} disabled={disabled}>
                        <InfoIcon color={tooltipIconColor} isOutline {...tooltipIconSize} />
                    </Tooltip>
                </View>
            </View>

            {userModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER ? (
                disabled ?
                    <RateMedal sliderValue={sliderValue} /> :
                    <>
                        <SmoothSlider
                            min={0}
                            max={100}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            selectedStyle={{ backgroundColor: colors.selectedSlider }}
                            containerStyle={styles.sliderContainer}
                            disabled={disabled}
                            decorator={decorators}
                            snapped={false}
                        />
                        <View style={styles.row}>
                            <Typography text={sliderValue.toString()} />
                        </View>
                    </>
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
