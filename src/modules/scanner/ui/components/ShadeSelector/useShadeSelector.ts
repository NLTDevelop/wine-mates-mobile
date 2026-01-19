import { useMemo, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
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
    const currentColor = useMemo(
        () => (value === 1 ? colorShades.tonePale : value === 2 ? colorShades.toneMedium : colorShades.toneDeep),
        [value, colorShades],
    );

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
            }).start(({ finished }) => {
                if (finished) {
                    onAnimationEnd?.();
                }
            });
        }
    }, [value, animatedValue, onAnimationEnd]);

    const onValueChange = (newValue: number) => {
        isDraggingRef.current = true;
        sliderValueRef.current = newValue;
        animatedValue.setValue(newValue);
    };

    const onSlidingStart = () => {
        isDraggingRef.current = true;
    };

    const onSlidingComplete = (newValue: number) => {
        isDraggingRef.current = false;
        let snappedValue: number;

        if (newValue < 1.5) {
            snappedValue = 1;
        } else if (newValue < 2.5) {
            snappedValue = 2;
        } else {
            snappedValue = 3;
        }

        if (snappedValue !== value) {
            onChange?.(snappedValue);
        } else {
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
        }
    };

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

    return {
        styles,
        markerSize: MARKER,
        markerInnerSize: MARKER_INNER,
        trackHeight: TRACK_HEIGHT,
        sliderValue: sliderValueRef.current,
        onValueChange,
        onSlidingStart,
        onSlidingComplete,
        onLabelPress,
        markerPosition,
        fillWidth,
        labels,
        currentColor,
        min: MIN,
        max: MAX,
    };
};
