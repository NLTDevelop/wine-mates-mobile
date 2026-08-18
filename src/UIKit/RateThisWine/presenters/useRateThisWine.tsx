import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from '../styles';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { EmptyStarIcon } from '@assets/icons/EmptyStarIcon';
import { Typography } from '@/UIKit/Typography';
import { scaleVertical } from '@/utils';
import { getWineLoverRatingDescription } from '../utils/getWineLoverRatingDescription';
import { STAR_SIZE } from '../constants';

interface StarIconProps {
    type: 'full' | 'half' | 'empty' | 'quarter' | 'three-quarter' | 'fraction';
    size: number;
    color: string;
    fill?: number;
    isFullTastingReview?: boolean
}

export const useRateThisWine = (disabled: boolean, starRate: number, sliderValue: number, hasChangedRating: boolean = false, isFullTastingReview, starSize: number = STAR_SIZE, onStarRatePreview?: (rating: number) => void, emptyRatingDescriptionText?: string) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [debouncedSliderValue, setDebouncedSliderValue] = useState(sliderValue);
    const [previewRating, setPreviewRating] = useState({
        sourceRating: starRate,
        value: starRate,
    });
    const displayedStarRate = previewRating.sourceRating === starRate ? previewRating.value : starRate;
    const starWidth = scaleVertical(starSize);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSliderValue(sliderValue);
        }, 150);

        return () => clearTimeout(timer);
    }, [sliderValue]);

    const StarIconComponent = useCallback(
        ({ type, size, color, fill }: StarIconProps) => {
            const baseSize = scaleVertical(size);
            const fillValue = Math.min(
                1,
                Math.max(
                    0,
                    (() => {
                        if (type === 'full') return 1;
                        if (type === 'three-quarter') return 0.75;
                        if (type === 'half') return 0.5;
                        if (type === 'quarter') return 0.25;
                        if (type === 'fraction') return fill ?? 0;
                        return 0;
                    })(),
                ),
            );

            if (fillValue <= 0) {
                return <EmptyStarIcon width={size} height={size} color={colors.icon} />;
            }

            if (fillValue >= 1) {
                return <FilledStarIcon width={size} height={size} color={color} />;
            }

            return (
                <View style={[styles.starIconContainer, { width: baseSize, height: baseSize }]}>
                    <EmptyStarIcon width={size} height={size} color={colors.icon} />
                    <View
                        style={[
                            styles.starFillOverlay,
                            {
                                width: baseSize * fillValue,
                                height: baseSize,
                            },
                        ]}
                    >
                        <FilledStarIcon width={size} height={size} color={color} />
                    </View>
                </View>
            );
        },
        [colors.icon, styles.starFillOverlay, styles.starIconContainer],
    );

    const tooltipContent = useMemo(() => {
        const ratingScale = [
            { rating: '5.0', label: t('wine.ratingScale.exceptional') },
            { rating: '4.5', label: t('wine.ratingScale.veryHighQuality') },
            { rating: '4.0', label: t('wine.ratingScale.good') },
            { rating: '3.5', label: t('wine.ratingScale.average') },
            { rating: '3.0', label: t('wine.ratingScale.mediocre') },
            { rating: '2.5–2.9', label: t('wine.ratingScale.poor') },
            { rating: '1.0–2.0', label: t('wine.ratingScale.defective') },
        ];

        return (
            <View style={styles.tooltipContent}>
                {ratingScale.map((item, index) => (
                    <View key={index} style={styles.tooltipRow}>
                        <FilledStarIcon width={16} height={16} color={colors.stars} />
                        <Typography
                            text={`${item.rating}`}
                            variant="body_500"
                            style={styles.tooltipText}
                        />
                        <Typography
                            text={` ${item.label}`}
                            variant="body_400"
                            style={styles.tooltipText}
                        />
                    </View>
                ))}
            </View>
        );
    }, [colors, styles.tooltipContent, styles.tooltipRow, styles.tooltipText, t]);

    const decorators = useMemo(() => {
        return {
            item: <View style={styles.decoratorItem} />,
            count: 9
        };
    }, [styles.decoratorItem]);

    const title = disabled 
        ? (hasChangedRating ? t('wine.ratedWine') : t('wine.didNotRateWine'))
        : isFullTastingReview ? t('wine.rateThisWineShort') : t('wine.rateThisWine');

    const currentRatingDescription = useMemo(() => {
        return getWineLoverRatingDescription(displayedStarRate, t);
    }, [displayedStarRate, t]);
    const currentRatingDescriptionText = displayedStarRate > 0 || emptyRatingDescriptionText === undefined
        ? `${displayedStarRate.toFixed(1)} ${currentRatingDescription}`
        : emptyRatingDescriptionText;

    const onPreviewStarRateChange = useCallback((rating: number) => {
        setPreviewRating({
            sourceRating: starRate,
            value: rating,
        });
        onStarRatePreview?.(rating);
    }, [onStarRatePreview, starRate]);

    return {
        StarIconComponent,
        tooltipContent,
        decorators,
        title,
        currentRatingDescription,
        currentRatingDescriptionText,
        displayedStarRate,
        onPreviewStarRateChange,
        starWidth,
        debouncedSliderValue,
    };
};
