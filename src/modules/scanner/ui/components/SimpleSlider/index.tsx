import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { PatternStripes } from '@/assets/icons/PatternStripes';
import { SliderMark } from '../SliderMark';
import { scaleVertical } from '@/utils';

const MIN = 1;
const MAX = 10;
const MARKER = scaleVertical(32);

interface IProps {
    value?: number;
    onChange?: (v: number) => void;
}

export const SimpleSlider = memo(({ value = MIN, onChange }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, MARKER), [colors]);

    const progress = (value - MIN) / (MAX - MIN);
    const baseWidth = styles.slider.width * progress;

    const fillWidth = Math.max(0, Math.min(styles.slider.width, baseWidth + MARKER / 2));
    const customMarker = useCallback(() => <SliderMark/>,[]);

    return (
      <View style={styles.container}>
        <View style={styles.wrap}>
            <View style={[styles.fill, { width: fillWidth }]}>
                <PatternStripes width={fillWidth} color={colors.background}/>
            </View>

            <MultiSlider
                values={[value]}
                onValuesChange={vals => onChange?.(vals[0])}
                min={MIN}
                max={MAX}
                step={1}
                snapped
                sliderLength={styles.slider.width}
                containerStyle={styles.slider}
                trackStyle={styles.track}
                selectedStyle={{ backgroundColor: 'transparent' }}
                unselectedStyle={styles.unselected}
                customMarker={customMarker}
            />
        </View>
      </View>
    );
});

SimpleSlider.displayName = 'SimpleSlider';
