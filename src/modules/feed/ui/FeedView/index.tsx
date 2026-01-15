import { useMemo, useState } from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { Typography } from '@/UIKit/Typography';
import { SmoothSlider } from '@/UIKit/SmoothSlider';
import { getStyles } from './styles';

const SLIDER_DATA = [
    { title: 'Один', value: '1' },
    { title: 'Два', value: '2' },
    { title: 'Три', value: '3' },
    { title: 'Четыре', value: '4' },
    { title: 'Пять', value: '5' },
];

export const FeedView = () => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [sliderValue, setSliderValue] = useState(2);
    const [simpleSliderValue, setSimpleSliderValue] = useState(50);

    return (
        <ScreenContainer edges={['top']}>
            <View style={styles.container}>
                <Typography text={'Feed Screen'} variant="h3" />
                <Typography text={`Slider value: ${SLIDER_DATA[sliderValue].title}`} variant="body_400" />
                <SmoothSlider
                    min={0}
                    max={4}
                    value={sliderValue}
                    onChange={setSliderValue}
                    labels={SLIDER_DATA.map(d => d.title)}
                    step={1}
                    snapped
                />

                <View style={styles.simpleSliderSection}>
                    <Typography text={'Simple Slider'} variant="h4" style={styles.sectionTitle} />
                    <Typography text={`Value: ${Math.round(simpleSliderValue)}`} variant="body_400" style={styles.valueText} />
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        value={simpleSliderValue}
                        onValueChange={setSimpleSliderValue}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor={colors.unselectedSlider}
                        thumbTintColor={colors.primary}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};
