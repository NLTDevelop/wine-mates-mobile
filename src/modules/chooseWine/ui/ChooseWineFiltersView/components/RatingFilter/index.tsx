import { ComponentProps, ReactElement, useMemo } from 'react';
import { View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { RangeSlider } from '@/UIKit/RangeSlider';
import { Tooltip } from '@/UIKit/Tooltip';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { InfoIcon } from '@assets/icons/InfoIcon';
import { useRateThisWine } from '@/UIKit/RateThisWine/presenters/useRateThisWine';
import { getStyles } from './styles';

interface IProps {
    isLoverRating: boolean;
    ratingMin: number;
    ratingMax: number;
    userRating: number;
    userRatingHintText: string;
    expertRatingMin: number;
    expertRatingMax: number;
    allowedExpertRatingMin: number;
    allowedExpertRatingMax: number;
    isExpertRatingDisabled: boolean;
    onExpertRatingRangeChange: (minValue: number, maxValue: number) => void;
    onUserRatingChange: (value: number) => void;
    onUserRatingEnd: (value: number) => void;
}

const DecimalStarRating = StarRating as unknown as (
    props: Omit<ComponentProps<typeof StarRating>, 'step'> & { step?: number | 'half' | 'quarter' | 'full' },
) => ReactElement;

export const RatingFilter = ({
    isLoverRating,
    ratingMin,
    ratingMax,
    userRating,
    userRatingHintText,
    expertRatingMin,
    expertRatingMax,
    allowedExpertRatingMin,
    allowedExpertRatingMax,
    isExpertRatingDisabled,
    onExpertRatingRangeChange,
    onUserRatingChange,
    onUserRatingEnd,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { StarIconComponent, tooltipContent } = useRateThisWine(false, userRating, expertRatingMin, false, false);

    return (
        <>
            <View style={styles.headerRow}>
                <Typography variant="h6" text={t('chooseWine.rating')} style={styles.sectionLabel} />
                {isLoverRating ? (
                    <Tooltip content={tooltipContent}>
                        <View style={styles.hintRow}>
                            <FilledStarIcon width={16} height={16} color={colors.stars} />
                            <Typography variant="subtitle_12_400" text={userRatingHintText} style={styles.hintText} />
                            <InfoIcon width={16} height={16} color={colors.primary} />
                        </View>
                    </Tooltip>
                ) : null}
            </View>
            {isLoverRating ? (
                <View style={styles.starsContainer}>
                    <DecimalStarRating
                        rating={userRating}
                        onChange={onUserRatingChange}
                        onRatingEnd={onUserRatingEnd}
                        step={0.1}
                        StarIconComponent={StarIconComponent}
                        starSize={40}
                        style={styles.starRating}
                        starStyle={styles.star}
                        starContainerStyle={styles.starContainer}
                        emptyColor={colors.icon}
                    />
                </View>
            ) : (
                <RangeSlider
                    min={ratingMin}
                    max={ratingMax}
                    minValue={expertRatingMin}
                    maxValue={expertRatingMax}
                    allowedMin={allowedExpertRatingMin}
                    allowedMax={allowedExpertRatingMax}
                    onChange={onExpertRatingRangeChange}
                    isDisabled={isExpertRatingDisabled}
                />
            )}
        </>
    );
};
