import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

export type SliderPart = [number, number];

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
