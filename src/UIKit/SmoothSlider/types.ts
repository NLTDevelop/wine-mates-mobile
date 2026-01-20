import { ReactNode } from 'react';

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
}
