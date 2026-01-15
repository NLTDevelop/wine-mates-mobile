import { memo, useMemo, ReactNode } from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { useSmoothSlider } from './useSmoothSlider';
import { getStyles } from './styles';
import { Marker } from './components/Marker';

export interface SliderDataPoint {
    title: string;
    value: string;
}

interface IProps {
    min?: number;
    max?: number;
    values?: number[];
    onValuesChange?: (values: number[]) => void;
    step?: number;
    snapped?: boolean;
    sliderLength?: number;
    customMarker?: () => ReactNode;
    trackStyle?: ViewStyle;
    selectedStyle?: ViewStyle;
    unselectedStyle?: ViewStyle;
    containerStyle?: ViewStyle;

    data?: SliderDataPoint[];
    labels?: string[];
    onLabelPress?: (index: number) => void;
    renderLabel?: (label: string, index: number) => ReactNode;
    withSections?: boolean;
    sections?: { key: number; left: number }[];
    disabled?: boolean;

    value?: number;
    onChange?: (value: number) => void;
    initialValue?: number;
    
    markerSize?: number;
    markerColor?: string;
    markerStyle?: ViewStyle;
    
    decorator?: {
        item: ReactNode;
        count: number;
    };
}

export const SmoothSlider = memo(({
    min = 0,
    max,
    values,
    onValuesChange,
    step = 1,
    snapped = true,
    sliderLength,
    customMarker,
    trackStyle,
    selectedStyle,
    unselectedStyle,
    containerStyle,
    data,
    labels,
    onLabelPress,
    renderLabel,
    withSections = false,
    sections,
    disabled = false,
    value,
    onChange,
    initialValue,
    markerSize,
    markerColor,
    markerStyle,
    decorator,
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, sliderLength), [colors, sliderLength]);

    const actualMax = max ?? (data ? data.length - 1 : 100);
    const actualValue = value ?? values?.[0] ?? initialValue ?? min;

    const handleValueChange = (newValue: number) => {
        onChange?.(newValue);
        onValuesChange?.([newValue]);
    };

    const { panGesture, thumbStyle, activeTrackStyle, handleLabelPress: handleLabelPressInternal, handleLayout } = useSmoothSlider({
        min,
        max: actualMax,
        initialValue: actualValue,
        onChange: handleValueChange,
        step,
        snapped,
    });

    const handleLabelClick = (index: number) => {
        handleLabelPressInternal(index);
        onLabelPress?.(index);
    };

    const displayLabels = labels ?? data?.map(d => d.title);

    const decoratorItems = useMemo(() => {
        if (!decorator || decorator.count <= 0) return [];
        
        return Array.from({ length: decorator.count }).map((_, index) => {
            const position = ((index + 1) / (decorator.count + 1)) * 100;
            return {
                key: index,
                leftPercent: position,
                item: decorator.item,
            };
        });
    }, [decorator]);

    return (
        <View style={[styles.container, containerStyle]} pointerEvents={disabled ? 'none' : 'auto'}>
            <View style={styles.sliderWrapper}>
                <View
                    style={styles.trackContainer}
                    onLayout={(event) => handleLayout(event.nativeEvent.layout.width)}
                >
                    <View style={[styles.track, trackStyle, unselectedStyle]} />
                    <Animated.View style={[styles.activeTrack, activeTrackStyle, selectedStyle]} />

                    {decorator && decoratorItems.length > 0 && (
                        <View style={styles.decoratorContainer}>
                            {decoratorItems.map((decoratorItem) => (
                                <View key={decoratorItem.key} style={[styles.decoratorItem, { left: `${decoratorItem.leftPercent}%` }]}>
                                    {decoratorItem.item}
                                </View>
                            ))}
                        </View>
                    )}

                    {withSections && sections && (
                        <View style={styles.sectionContainer}>
                            {sections.map(section => (
                                <View key={section.key} style={[styles.section, { left: section.left }]} />
                            ))}
                        </View>
                    )}

                    <GestureDetector gesture={panGesture}>
                        <Animated.View style={[styles.thumbWrapper, thumbStyle]}>
                            {customMarker ? customMarker() : <Marker size={markerSize} color={markerColor} style={markerStyle} />}
                        </Animated.View>
                    </GestureDetector>
                </View>
            </View>

            {displayLabels && displayLabels.length > 0 && (
                <View style={styles.labelsContainer}>
                    {displayLabels.map((label, index) => (
                        <Pressable
                            key={`${label}-${index}`}
                            style={styles.labelWrapper}
                            onPress={() => handleLabelClick(index)}
                        >
                            {renderLabel ? (
                                renderLabel(label, index)
                            ) : (
                                <Typography
                                    text={label}
                                    variant="body_400"
                                    style={styles.labelText}
                                    numberOfLines={1}
                                />
                            )}
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
});

SmoothSlider.displayName = 'SmoothSlider';
