import { useCallback, useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { FilledStarIcon } from '@assets/icons/FilledStarIcon';
import { EmptyStarIcon } from '@assets/icons/EmptyStarIcon';
import { userModel } from '@/entities/users/UserModel';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { scaleVertical } from '@/utils';

interface IProps {
    sliderValue: number;
    handleSliderChange?: (value: number) => void;
    starRate: number;
    onStarRateChange?: (value: number) => void;
    disabled?: boolean;
}

interface StarIconProps {
    type: 'full' | 'half' | 'empty' | 'quarter' | 'three-quarter' | 'fraction';
    size: number;
    color: string;
    fill?: number;
}

export const RateThisWine = ({ sliderValue, handleSliderChange, starRate, onStarRateChange, disabled = false }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
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

    const decorators = useMemo(() => {
        return {
            item: <View style={styles.decoratorItem} />,
            count: 9
        };
    }, [styles.decoratorItem]);

    return (
        <View style={styles.container}>
            <Typography text={t('wine.rateThisWine')} variant="subtitle_20_500" style={styles.title} />
            {userModel.user?.wineExperienceLevel !== WineExperienceLevelEnum.LOVER ? (
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
