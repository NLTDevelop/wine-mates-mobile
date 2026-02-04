import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { Marker } from './components/Marker';
import { usePartitionedSliderGesture } from './presenters/usePartitionedSliderGesture';
import { PartitionedSliderProps } from './types';

export const PartitionedSlider = memo(
    ({
        parts,
        value,
        onChange,
        selectedStyle,
        containerStyle,
        disabled = false,
        decorator,
    }: PartitionedSliderProps) => {
        const { colors } = useUiContext();
        const styles = useMemo(() => getStyles(colors), [colors]);

        const {
            panGesture,
            tapGesture,
            thumbStyle,
            activeTrackStyle,
            handleLayout,
        } = usePartitionedSliderGesture({
            parts,
            initialValue: value,
            onChange,
            decoratorCount: decorator?.count ?? 0,
        });

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
                    <GestureDetector gesture={tapGesture}>
                        <View
                            style={styles.trackContainer}
                            onLayout={event => handleLayout(event.nativeEvent.layout.width)}
                        >
                            <View style={styles.track} />
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

                            <GestureDetector gesture={panGesture}>
                                <Animated.View style={[styles.thumbWrapper, thumbStyle]}>
                                    <Marker />
                                </Animated.View>
                            </GestureDetector>
                        </View>
                    </GestureDetector>
                </View>
            </View>
        );
    },
);

PartitionedSlider.displayName = 'PartitionedSlider';
