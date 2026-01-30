import { useMemo, useRef, useEffect, useCallback } from 'react';
import { Animated, PanResponder } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { getStyles } from './styles';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';

const MIN = 1;
const MAX = 3;
const MARKER = scaleVertical(48);
const TRACK_HEIGHT = scaleVertical(48);
const MARKER_INNER = scaleVertical(32);
const SLIDER_LENGTH = scaleHorizontal(343) - MARKER;

interface UseShadeSelectorParams {
    value?: number;
    onChange?: (v: number) => void;
    colorShades: IWineColorShade;
    onAnimationEnd?: () => void;
}

export const useShadeSelector = ({ value = MIN, onChange, colorShades, onAnimationEnd }: UseShadeSelectorParams) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors, MARKER, TRACK_HEIGHT, SLIDER_LENGTH), [colors]);

    const animatedValue = useMemo(() => new Animated.Value(value), []);
    
    const currentColor = animatedValue.interpolate({
        inputRange: [MIN, 2, MAX],
        outputRange: [colorShades.tonePale, colorShades.toneMedium, colorShades.toneDeep],
    });
    const sliderValueRef = useRef(value);
    const isDraggingRef = useRef(false);
    const trackWidthRef = useRef(SLIDER_LENGTH);
    const dragAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (!isDraggingRef.current) {
            Animated.spring(animatedValue, {
                toValue: value,
                useNativeDriver: false,
                damping: 15,
                stiffness: 150,
            }).start(({ finished }) => {
                if (finished) {
                    onAnimationEnd?.();
                }
            });
        }
    }, [value, animatedValue, onAnimationEnd]);


    const snapToNearest = useCallback((currentValue: number) => {
        let snappedValue: number;

        if (currentValue < 1.5) {
            snappedValue = 1;
        } else if (currentValue < 2.5) {
            snappedValue = 2;
        } else {
            snappedValue = 3;
        }

        sliderValueRef.current = snappedValue;

        Animated.spring(animatedValue, {
            toValue: snappedValue,
            useNativeDriver: false,
            damping: 15,
            stiffness: 150,
        }).start(({ finished }) => {
            if (finished) {
                onAnimationEnd?.();
            }
        });

        if (snappedValue !== value) {
            onChange?.(snappedValue);
        }
    }, [animatedValue, value, onChange, onAnimationEnd]);

    const trackLayoutRef = useRef({ x: 0, y: 0, width: SLIDER_LENGTH });

    const updateSliderValue = useCallback((newValue: number) => {
        sliderValueRef.current = newValue;
        
        if (dragAnimationRef.current) {
            dragAnimationRef.current.stop();
        }
        
        dragAnimationRef.current = Animated.timing(animatedValue, {
            toValue: newValue,
            duration: 50,
            useNativeDriver: false,
        });
        
        dragAnimationRef.current.start();
    }, [animatedValue]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    isDraggingRef.current = true;
                    const touchX = evt.nativeEvent.pageX;
                    const trackX = trackLayoutRef.current.x;
                    const trackWidth = trackLayoutRef.current.width;
                    
                    const relativeX = touchX - trackX;
                    const clampedX = Math.max(0, Math.min(trackWidth, relativeX));
                    const newValue = MIN + (clampedX / trackWidth) * (MAX - MIN);
                    
                    updateSliderValue(newValue);
                },
                onPanResponderMove: (evt) => {
                    const touchX = evt.nativeEvent.pageX;
                    const trackX = trackLayoutRef.current.x;
                    const trackWidth = trackLayoutRef.current.width;
                    
                    const relativeX = touchX - trackX;
                    const clampedX = Math.max(0, Math.min(trackWidth, relativeX));
                    const newValue = MIN + (clampedX / trackWidth) * (MAX - MIN);
                    
                    updateSliderValue(newValue);
                },
                onPanResponderRelease: () => {
                    if (dragAnimationRef.current) {
                        dragAnimationRef.current.stop();
                    }
                    isDraggingRef.current = false;
                    const currentValue = sliderValueRef.current;
                    snapToNearest(currentValue);
                },
                onPanResponderTerminate: () => {
                    if (dragAnimationRef.current) {
                        dragAnimationRef.current.stop();
                    }
                    isDraggingRef.current = false;
                    const currentValue = sliderValueRef.current;
                    snapToNearest(currentValue);
                },
            }),
        [updateSliderValue, snapToNearest],
    );

    const onLabelPress = (labelValue: number) => {
        if (labelValue !== value) {
            onChange?.(labelValue);
        }
    };

    const markerPosition = animatedValue.interpolate({
        inputRange: [MIN, MAX],
        outputRange: [0, SLIDER_LENGTH],
    });

    const fillWidth = animatedValue.interpolate({
        inputRange: [MIN, MAX],
        outputRange: [MARKER, SLIDER_LENGTH + MARKER],
    });

    const labels = {
        left: t('wine.pale'),
        middle: t('wine.medium'),
        right: t('wine.deep'),
    };

    const onTrackLayout = useCallback((event: any) => {
        const { width } = event.nativeEvent.layout;
        trackWidthRef.current = width;
        trackLayoutRef.current.width = width;
        
        event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            trackLayoutRef.current = { x: pageX, y: pageY, width };
        });
    }, []);

    return {
        styles,
        markerSize: MARKER,
        markerInnerSize: MARKER_INNER,
        trackHeight: TRACK_HEIGHT,
        panResponder,
        onLabelPress,
        markerPosition,
        fillWidth,
        labels,
        currentColor,
        onTrackLayout,
    };
};
