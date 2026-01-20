import { memo, useMemo, useRef, useEffect } from 'react';
import { View, ViewStyle, Animated, Pressable } from 'react-native';
import RNSlider from '@react-native-community/slider';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { useSlider } from './useSlider.tsx';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    min: number;
    max: number;
    value: number;
    onChange: (v: number) => void;
    selectedColor: string;
    withSections?: boolean;
    disabled?: boolean;
    labels?: string[];
}

export const Slider = memo(({ min, max, value, onChange, selectedColor, withSections = true, disabled = false, labels }: IProps) => {
    const { colors } = useUiContext();
    const { MARKER, TRACK_HEIGHT, SLIDER_LENGTH, customMarker, sections } = useSlider({ min, max });
    const styles = useMemo(() => getStyles(colors, MARKER, TRACK_HEIGHT, SLIDER_LENGTH), [colors, MARKER, TRACK_HEIGHT, SLIDER_LENGTH]);

    const animatedValue = useMemo(() => new Animated.Value(value), []);
    const sliderValueRef = useRef(value);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        if (!isDraggingRef.current) {
            Animated.spring(animatedValue, {
                toValue: value,
                useNativeDriver: false,
                damping: 15,
                stiffness: 150,
            }).start();
        }
    }, [value, animatedValue]);

    const handleValueChange = (newValue: number) => {
        isDraggingRef.current = true;
        sliderValueRef.current = newValue;
        animatedValue.setValue(newValue);
    };

    const handleSlidingStart = () => {
        isDraggingRef.current = true;
    };

    const handleSlidingComplete = (newValue: number) => {
        isDraggingRef.current = false;
        const snappedValue = Math.round(newValue);
        
        if (snappedValue !== value) {
            onChange(snappedValue);
        } else {
            Animated.spring(animatedValue, {
                toValue: snappedValue,
                useNativeDriver: false,
                damping: 15,
                stiffness: 150,
            }).start();
        }
    };

    const handleSectionPress = (sectionIndex: number) => {
        const targetValue = min + sectionIndex + 1;
        if (targetValue !== value && targetValue >= min && targetValue <= max) {
            onChange(targetValue);
        }
    };

    const handleLabelPress = (labelIndex: number) => {
        const targetValue = min + labelIndex;
        if (targetValue !== value && targetValue >= min && targetValue <= max) {
            onChange(targetValue);
        }
    };

    const markerPosition = animatedValue.interpolate({
        inputRange: [min, max],
        outputRange: [0, SLIDER_LENGTH],
    });

    const isTriple = labels && labels.length === 3;
    const middleIndex = labels ? Math.floor(labels.length / 2) : 0;

    return (
        <View style={styles.container} pointerEvents={disabled ? "none" : "auto"}>
            <View style={styles.sliderWrapper}>
                <RNSlider
                    style={styles.slider}
                    minimumValue={min}
                    maximumValue={max}
                    value={sliderValueRef.current}
                    onValueChange={handleValueChange}
                    onSlidingStart={handleSlidingStart}
                    onSlidingComplete={handleSlidingComplete}
                    minimumTrackTintColor={selectedColor}
                    maximumTrackTintColor={colors.unselectedSlider}
                    thumbTintColor="transparent"
                />
                {withSections && (
                    <View style={styles.sectionContainer} pointerEvents="none">
                        {sections.map((section, index) => (
                            <View 
                                key={section.key} 
                                style={[styles.section, { left: section.left }]}
                            />
                        ))}
                    </View>
                )}
                <Animated.View style={[styles.markerContainer, { left: markerPosition }]}>
                    {customMarker()}
                </Animated.View>
            </View>
            {labels && labels.length > 0 && (
                <View style={styles.labelsContainer}>
                    <Pressable onPress={() => handleLabelPress(0)} style={styles.labelLeft}>
                        <Typography text={labels[0]} variant="body_500" style={styles.labelText} />
                    </Pressable>
                    {isTriple && labels[middleIndex] && (
                        <Pressable onPress={() => handleLabelPress(middleIndex)} style={styles.labelCenter}>
                            <Typography text={labels[middleIndex]} variant="body_500" style={styles.labelText} />
                        </Pressable>
                    )}
                    <Pressable onPress={() => handleLabelPress(labels.length - 1)} style={styles.labelRight}>
                        <Typography text={labels[labels.length - 1]} variant="body_500" style={styles.labelText} />
                    </Pressable>
                </View>
            )}
        </View>
    );
});

Slider.displayName = 'Slider';
