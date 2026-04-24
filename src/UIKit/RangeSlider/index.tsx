import { useMemo, useState } from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';
import { useRangeSlider } from './presenters/useRangeSlider';
import { Marker } from '@/UIKit/SmoothSlider/components/Marker';
import { scaleHorizontal } from '@/utils';

interface IProps {
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onChange: (minValue: number, maxValue: number) => void;
    step?: number;
    sliderLength?: number;
    containerStyle?: ViewStyle;
    valueSuffix?: string;
}

export const RangeSlider = ({
    min,
    max,
    minValue,
    maxValue,
    onChange,
    step = 1,
    sliderLength,
    containerStyle,
    valueSuffix = '',
}: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [liveValues, setLiveValues] = useState<{ min: number; max: number } | null>(null);
    const actualSliderLength = sliderLength ?? scaleHorizontal(343) - scaleHorizontal(40);
    const onRangeChange = (nextMin: number, nextMax: number) => {
        setLiveValues(null);
        onChange(nextMin, nextMax);
    };
    const {
        minPanGesture,
        maxPanGesture,
        minThumbStyle,
        maxThumbStyle,
        activeTrackStyle,
        trackRef,
        onTrackLayout,
        onTrackPress,
    } = useRangeSlider({
        min,
        max,
        minValue,
        maxValue,
        onChange: onRangeChange,
        step,
        onValuesLive: (nextMin, nextMax) => {
            setLiveValues({ min: nextMin, max: nextMax });
        },
    });
    const displayedMinValue = liveValues ? liveValues.min : minValue;
    const displayedMaxValue = liveValues ? liveValues.max : maxValue;

    return (
        <>
            <View style={[styles.container, containerStyle]}>
                <View style={styles.sliderWrapper}>
                    <Pressable
                        ref={trackRef}
                        style={[styles.trackContainer, { width: actualSliderLength }]}
                        onLayout={onTrackLayout}
                        onPress={onTrackPress}
                    >
                        <View style={styles.track} />
                        <Animated.View style={[styles.activeTrack, activeTrackStyle]} />

                        <GestureDetector gesture={minPanGesture}>
                            <Animated.View style={[styles.thumbWrapper, minThumbStyle]}>
                                <Marker size={scaleHorizontal(20)} color={colors.primary} style={styles.marker} />
                            </Animated.View>
                        </GestureDetector>

                        <GestureDetector gesture={maxPanGesture}>
                            <Animated.View style={[styles.thumbWrapper, maxThumbStyle]}>
                                <Marker size={scaleHorizontal(20)} color={colors.primary} style={styles.marker} />
                            </Animated.View>
                        </GestureDetector>
                    </Pressable>
                </View>
            </View>
            <View style={styles.labelsContainer}>
                    <Typography
                        text={`${displayedMinValue}${valueSuffix}`}
                        variant="subtitle_12_400"
                        style={styles.labelText}
                    />
                    <Typography
                        text={`${displayedMaxValue}${valueSuffix}`}
                        variant="subtitle_12_400"
                        style={styles.labelText}
                    />
            </View>
        </>
    );
};
