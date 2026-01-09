import { memo, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { useSlider } from './useSlider.tsx';

interface IProps {
    min: number;
    max: number;
    value: number;
    onChange: (v: number) => void;
    selectedColor: string;
    withSections?: boolean;
    containerStyle?: ViewStyle;
    disabled?: boolean;
}

export const Slider = memo(({ min, max, value, onChange, selectedColor, withSections = true, containerStyle, disabled = false }: IProps) => {
    const { colors } = useUiContext();
    const { MARKER, TRACK_HEIGHT, SLIDER_LENGTH, customMarker, sections } = useSlider({ min, max });
    const styles = useMemo(() => getStyles(colors, MARKER, TRACK_HEIGHT, SLIDER_LENGTH), [colors, MARKER, TRACK_HEIGHT, SLIDER_LENGTH]);

    return (
        <View style={[styles.container, containerStyle]} pointerEvents={disabled ? "none" : "auto"}>
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
            {withSections && (
                <View style={styles.sectionContainer}>
                    {sections.map(section => (
                        <View key={section.key} style={[styles.section, { left: section.left }]} />
                    ))}
                </View>
            )}
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
