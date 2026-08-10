import { ReactNode } from 'react';
import type { useAnimatedStyle } from 'react-native-reanimated';
import type { Gesture } from 'react-native-gesture-handler';

export interface SliderDataPoint {
    title: string;
    value: string;
}

export interface SmoothSliderLabelItem {
    label: string;
    index?: number;
}

export interface NormalizedLabel {
    label: string;
    index: number;
}

export interface DecoratorItem {
    key: number;
    leftPercent: number;
    item: ReactNode;
}

export interface UseSliderGestureProps {
    min: number;
    max: number;
    initialValue?: number;
    onChange?: (value: number) => void;
    step?: number;
    snapped?: boolean;
}

type AnimatedStyleReturn = ReturnType<typeof useAnimatedStyle>;
type PanGestureType = ReturnType<typeof Gesture.Pan>;

export interface UseSliderGestureReturn {
    panGesture: PanGestureType;
    thumbStyle: AnimatedStyleReturn;
    activeTrackStyle: AnimatedStyleReturn;
    onLabelPress: (index: number) => void;
    onLayout: (width: number) => void;
    onTrackPress: (locationX: number) => void;
}

export interface UseSmoothSliderProps {
    min?: number;
    max?: number;
    values?: number[];
    onValuesChange?: (values: number[]) => void;
    step?: number;
    snapped?: boolean;
    sliderLength?: number;
    data?: SliderDataPoint[];
    labels?: Array<string | SmoothSliderLabelItem>;
    onLabelPress?: (index: number) => void;
    value?: number;
    onChange?: (value: number) => void;
    initialValue?: number;
    decorator?: {
        item: ReactNode;
        count: number;
    };
    edgeAlignedLabels?: boolean;
}
