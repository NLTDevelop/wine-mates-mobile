import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { Marker } from './components/Marker';

const MARKER = scaleVertical(20);
const TRACK_HEIGHT = scaleVertical(8);
const SLIDER_LENGTH = scaleHorizontal(343) - MARKER;

interface IProps {
    min: number;
    max: number;
    value: number;
    onChange: (v: number) => void;
    selectedColor: string;
    withSections?: boolean
}

export const Slider = memo(({ min, max, value, onChange, selectedColor, withSections = true}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, MARKER, TRACK_HEIGHT, SLIDER_LENGTH), [colors]);

    const customMarker = useCallback(() => <Marker size={MARKER} trackHeight={TRACK_HEIGHT} />, []);

    const sectionsCount = useMemo(() => {
        const raw = max - 2;
        return raw > 20 ? 8 : raw;
    }, [max]);

    const sections = useMemo(
        () =>
            Array.from({ length: sectionsCount }).map((_, i) => {
                const left = ((i + 1) / (sectionsCount + 1)) * SLIDER_LENGTH;
                return <View key={i} style={[styles.section, { left }]} />;
            }),
        [sectionsCount, styles],
    );

    return (
        <View style={styles.container}>
            {/* If required full width */}
            {/* <View style={styles.trackBackground}>
                <View
                    style={[
                        styles.leftSide,
                        { backgroundColor: value === 1 ? colors.unselectedSlider : selectedColor },
                    ]}
                />
                <View style={[styles.rightSide, { backgroundColor: colors.unselectedSlider }]} />
            </View> */}
            {withSections && <View style={styles.sectionContainer}>{sections}</View>}
            <MultiSlider
                values={[value]}
                onValuesChange={vals => onChange(vals[0])}
                min={min}
                max={max}
                step={1}
                snapped
                sliderLength={SLIDER_LENGTH}
                containerStyle={styles.slider}
                trackStyle={styles.track}
                selectedStyle={{ backgroundColor: selectedColor }}
                unselectedStyle={styles.unselected}
                customMarker={customMarker}
            />
        </View>
    );
});

Slider.displayName = 'Slider';
