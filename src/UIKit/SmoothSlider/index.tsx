import { memo, ReactNode } from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Typography } from '@/UIKit/Typography';
import { useSmoothSlider } from './presenters/useSmoothSlider.ts';
import { Marker } from './components/Marker';
import { SliderDataPoint, SmoothSliderLabelItem } from './types';

export type { SliderDataPoint } from './types';

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
    labels?: Array<string | SmoothSliderLabelItem>;
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
        decoratorContainerStyle?: ViewStyle;
    };
}

export const SmoothSlider = memo(
    ({
        min,
        max,
        values,
        onValuesChange,
        step,
        snapped,
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
        const {
            panGesture,
            thumbStyle,
            activeTrackStyle,
            handleLayout,
            styles,
            normalizedLabels,
            decoratorItems,
            handleLabelClick,
        } = useSmoothSlider({
            min,
            max,
            values,
            onValuesChange,
            step,
            snapped,
            sliderLength,
            data,
            labels,
            onLabelPress,
            value,
            onChange,
            initialValue,
            decorator,
        });

        return (
            <View style={[styles.container, containerStyle]} pointerEvents={disabled ? 'none' : 'auto'}>
                <View style={styles.sliderWrapper}>
                    <View
                        style={styles.trackContainer}
                        onLayout={event => handleLayout(event.nativeEvent.layout.width)}
                    >
                        <View style={[styles.track, trackStyle, unselectedStyle]} />
                        <Animated.View style={[styles.activeTrack, activeTrackStyle, selectedStyle]} />

                        {decorator && decoratorItems.length > 0 && (
                            <View style={[styles.decoratorContainer, decorator.decoratorContainerStyle]}>
                                {decoratorItems.map(decoratorItem => (
                                    <View
                                        key={decoratorItem.key}
                                        style={[styles.decoratorItem, { left: `${decoratorItem.leftPercent}%` }]}
                                    >
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
                                {customMarker ? (
                                    customMarker()
                                ) : (
                                    <Marker size={markerSize} color={markerColor} style={markerStyle} />
                                )}
                            </Animated.View>
                        </GestureDetector>
                    </View>
                </View>

                {normalizedLabels && normalizedLabels.length > 0 && (
                    <View style={styles.labelsContainer}>
                        {normalizedLabels.map(({ label, index: targetIndex }, index) => {
                            const isFirst = index === 0;
                            const isLast = index === normalizedLabels.length - 1;
                            const isMiddle = !isFirst && !isLast;

                            return (
                                <Pressable
                                    key={`${label}-${index}`}
                                    style={[
                                        styles.labelWrapper,
                                        isMiddle && styles.middleLabelWrapper,
                                        isFirst && styles.leftLabelWrapper,
                                        isLast && styles.rightLabelWrapper,
                                    ]}
                                    onPress={() => handleLabelClick(targetIndex)}
                                >
                                    {renderLabel ? (
                                        renderLabel(label, index)
                                    ) : (
                                        <Typography
                                            text={label}
                                            variant="h5"
                                            style={[
                                                styles.labelText,
                                                isFirst && styles.leftLabelText,
                                                isLast && styles.rightLabelText,
                                            ]}
                                            numberOfLines={isMiddle ? 2 : undefined}
                                        />
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    },
);

SmoothSlider.displayName = 'SmoothSlider';
