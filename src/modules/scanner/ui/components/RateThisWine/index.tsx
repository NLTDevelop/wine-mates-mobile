import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Slider } from '@/UIKit/Slider';

interface IProps {
    isPremiumUser: boolean;
    sliderValue: number;
    handleSliderChange: (value: number) => void;
}

export const RateThisWine = ({ isPremiumUser, sliderValue, handleSliderChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={t('wine.rateThisWine')} variant="subtitle_20_500" style={styles.title} />
            {isPremiumUser ? (
                <>
                    <Slider
                        min={0}
                        max={100}
                        value={sliderValue}
                        onChange={handleSliderChange}
                        selectedColor={colors.selectedSlider}
                        containerStyle={styles.sliderContainer}
                    />
                    <View style={styles.row}>
                        <Typography text={'0'} />
                        <Typography text={'100'} />
                    </View>
                </>
            ) : (
                <View></View>
            )}
        </View>
    );
};
