import { ReactNode } from 'react';
import { LayoutChangeEvent, ViewStyle } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export type SliderPart = [number, number];
export type AnimatedStyleReturn = ReturnType<typeof useAnimatedStyle>;
export type PanGestureType = ReturnType<typeof Gesture.Pan>;
export type TapGestureType = ReturnType<typeof Gesture.Tap>;

export interface PartitionedSliderProps {
    parts: SliderPart[];
    value: number;
    onChange?: (value: number) => void;
    selectedStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    disabled?: boolean;
    decorator?: {
        item: ReactNode;
        count: number;
        decoratorContainerStyle?: ViewStyle;
    };
    partTrackColors?: string[];
}

export interface UsePartitionedSliderGestureReturn {
    panGesture: PanGestureType;
    tapGesture: TapGestureType;
    thumbStyle: AnimatedStyleReturn;
    activeTrackStyle: AnimatedStyleReturn;
    onLayout: (width: number) => void;
    onTrackLayout: (event: LayoutChangeEvent) => void;
}
