import { memo } from 'react';
import { View, Animated, Pressable } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';
import { useShadeSelector } from './presenters/useShadeSelector';
import { ShadeSliderMark } from './components/ShadeSliderMark';

interface IProps {
    value?: number;
    onChange?: (v: number) => void;
    colorShades: IWineColorShade;
    onAnimationEnd?: () => void;
}

export const ShadeSelector = memo((props: IProps) => {
    const {
        styles,
        markerSize,
        markerInnerSize,
        trackHeight,
        panResponder,
        markerPosition,
        fillWidth,
        labels,
        currentColor,
        onTrackLayout,
        onLeftLabelPress,
        onMiddleLabelPress,
        onRightLabelPress,
    } = useShadeSelector(props);

    return (
        <View style={styles.container}>
            <View style={styles.trackBackground}>
                <Animated.View style={[styles.fillTrack, { width: fillWidth, backgroundColor: currentColor }]} />
                <View style={styles.unselectedTrack} />
            </View>
            <View style={styles.sliderWrapper} onLayout={onTrackLayout} {...panResponder.panHandlers}>
                <Animated.View style={[styles.markerContainer, { left: markerPosition }]}>
                    <ShadeSliderMark
                        size={markerSize}
                        innerSize={markerInnerSize}
                        selectedColor={currentColor}
                        trackHeight={trackHeight}
                    />
                </Animated.View>
            </View>
            <View style={styles.labelsContainer}>
                <Pressable onPress={onLeftLabelPress}>
                    <Typography text={labels.left} variant="h6" style={styles.label} />
                </Pressable>
                <View style={styles.labelWrapper}>
                    <Pressable onPress={onMiddleLabelPress}>
                        <Typography text={labels.middle} variant="h6" style={styles.label} />
                    </Pressable>
                </View>
                <Pressable onPress={onRightLabelPress}>
                    <Typography text={labels.right} variant="h6" style={styles.label} />
                </Pressable>
            </View>
        </View>
    );
});

ShadeSelector.displayName = 'ShadeSelector';
