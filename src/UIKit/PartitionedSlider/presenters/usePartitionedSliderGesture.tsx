import { useSharedValue, useAnimatedStyle, withSpring, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { SliderPart } from '../types';

interface UsePartitionedSliderGestureProps {
    parts: SliderPart[];
    initialValue: number;
    onChange?: (value: number) => void;
    decoratorCount?: number;
}

type AnimatedStyleReturn = ReturnType<typeof useAnimatedStyle>;
type PanGestureType = ReturnType<typeof Gesture.Pan>;
type TapGestureType = ReturnType<typeof Gesture.Tap>;

export interface UsePartitionedSliderGestureReturn {
    panGesture: PanGestureType;
    tapGesture: TapGestureType;
    thumbStyle: AnimatedStyleReturn;
    activeTrackStyle: AnimatedStyleReturn;
    handleLayout: (width: number) => void;
}

export const usePartitionedSliderGesture = ({
    parts,
    initialValue,
    onChange,
    decoratorCount = 0,
}: UsePartitionedSliderGestureProps): UsePartitionedSliderGestureReturn => {
    const position = useSharedValue(0);
    const startPosition = useSharedValue(0);
    const sliderWidth = useSharedValue(0);

    const valueToPosition = (value: number) => {
        'worklet';
        
        let cumulativePosition = 0;
        const partCount = parts.length;
        const partWidth = 1 / partCount;

        for (let i = 0; i < parts.length; i++) {
            const [partMin, partMax] = parts[i];
            
            if (value >= partMin && value <= partMax) {
                const partRange = partMax - partMin;
                const valueInPart = value - partMin;
                const ratioInPart = partRange > 0 ? valueInPart / partRange : 0;
                return cumulativePosition + ratioInPart * partWidth;
            }
            
            cumulativePosition += partWidth;
        }

        return cumulativePosition;
    };

    const positionToValue = (pos: number) => {
        'worklet';
        
        const clampedPos = Math.max(0, Math.min(1, pos));
        const partCount = parts.length;
        const partWidth = 1 / partCount;
        
        const partIndex = Math.floor(clampedPos / partWidth);
        const safePartIndex = Math.min(partIndex, parts.length - 1);
        const [partMin, partMax] = parts[safePartIndex];
        
        const positionInPart = (clampedPos - safePartIndex * partWidth) / partWidth;
        const partRange = partMax - partMin;
        const value = partMin + positionInPart * partRange;
        
        return Math.max(partMin, Math.min(partMax, value));
    };

    useAnimatedReaction(
        () => positionToValue(position.value),
        (currentValue, previousValue) => {
            if (currentValue !== previousValue && onChange) {
                scheduleOnRN(onChange, Math.round(currentValue));
            }
        }
    );

    const snapToNearestDecorator = (pos: number) => {
        'worklet';
        
        if (decoratorCount <= 0) return pos;
        
        const decoratorPositions: number[] = [];
        for (let i = 0; i < decoratorCount; i++) {
            decoratorPositions.push(((i + 1) / (decoratorCount + 1)));
        }
        
        let nearestPos = pos;
        let minDistance = Infinity;
        
        for (const decoratorPos of decoratorPositions) {
            const distance = Math.abs(pos - decoratorPos);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPos = decoratorPos;
            }
        }
        
        const snapThreshold = 0.03;
        if (minDistance < snapThreshold) {
            return nearestPos;
        }
        
        return pos;
    };

    const snapToValue = (pos: number) => {
        'worklet';
        
        const snappedPos = snapToNearestDecorator(pos);
        
        position.value = withSpring(snappedPos, {
            damping: 10,
            stiffness: 100,
            mass: 0.5,
        }, (finished) => {
            'worklet';
            if (finished && onChange) {
                const finalValue = positionToValue(snappedPos);
                scheduleOnRN(onChange, Math.round(finalValue));
            }
        });
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            startPosition.value = position.value;
        })
        .onUpdate((event) => {
            const delta = event.translationX / sliderWidth.value;
            const newPosition = startPosition.value + delta;
            position.value = Math.max(0, Math.min(1, newPosition));
        })
        .onEnd(() => {
            snapToValue(position.value);
        });

    const tapGesture = Gesture.Tap()
        .onEnd((event) => {
            const tapPosition = event.x / sliderWidth.value;
            const clampedPosition = Math.max(0, Math.min(1, tapPosition));
            snapToValue(clampedPosition);
        });

    const thumbStyle = useAnimatedStyle(() => {
        const translateX = position.value * sliderWidth.value;
        return {
            transform: [{ translateX }],
        };
    });

    const activeTrackStyle = useAnimatedStyle(() => {
        const width = position.value * sliderWidth.value;
        return { width };
    });

    const handleLayout = (width: number) => {
        sliderWidth.value = width;
        const initialPos = valueToPosition(initialValue);
        position.value = initialPos;
    };

    return {
        panGesture,
        tapGesture,
        thumbStyle,
        activeTrackStyle,
        handleLayout,
    };
};
