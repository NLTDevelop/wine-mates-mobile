import { memo, useMemo, useRef, useEffect } from 'react';
import { View, Animated, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { scaleHorizontal, scaleVertical } from '@/utils';
import { ShadeSliderMark } from '../ShadeSliderMark';
import { Typography } from '@/UIKit/Typography';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';

const MIN = 1;
const MAX = 3;
const MARKER = scaleVertical(48);
const TRACK_HEIGHT = scaleVertical(48);
const MARKER_INNER = scaleVertical(32);
const SLIDER_LENGTH = scaleHorizontal(343) - MARKER;

interface IProps {
    value?: number;
    onChange?: (v: number) => void;
    colorShades: IWineColorShade;
}

export const ShadeSelector = memo(({ value = MIN, onChange, colorShades }: IProps) => {
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
            }).start();
        }
    }, [value, animatedValue]);

    const handleValueChange = (newValue: number) => {
        isDraggingRef.current = true;
        sliderValueRef.current = newValue;
        animatedValue.setValue(newValue);
    };

    const handleSlidingStart = () => {
        isDraggingRef.current = true;
    };

    const handleSlidingComplete = (newValue: number) => {
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
            }).start();
        }
    };

    const handleLabelPress = (labelValue: number) => {
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
        outputRange: [0, SLIDER_LENGTH + MARKER],
    });

    return (
        <View style={styles.container}>
            <View style={styles.trackBackground}>
                <Animated.View style={[styles.fillTrack, { width: fillWidth, backgroundColor: currentColor }]} />
                <View style={styles.unselectedTrack} />
            </View>
            <View style={styles.sliderWrapper}>
                <Slider
                    style={styles.slider}
                    minimumValue={MIN}
                    maximumValue={MAX}
                    value={sliderValueRef.current}
                    onValueChange={handleValueChange}
                    onSlidingStart={handleSlidingStart}
                    onSlidingComplete={handleSlidingComplete}
                    minimumTrackTintColor="transparent"
                    maximumTrackTintColor="transparent"
                    thumbTintColor="transparent"
                />
                <Animated.View style={[styles.markerContainer, { left: markerPosition }]}>
                    <ShadeSliderMark
                        size={MARKER}
                        innerSize={MARKER_INNER}
                        selectedColor={currentColor}
                        trackHeight={TRACK_HEIGHT}
                    />
                </Animated.View>
            </View>
            <View style={styles.labelsContainer}>
                <Pressable onPress={() => handleLabelPress(1)}>
                    <Typography text={t('wine.pale')} variant="h6" style={styles.label} />
                </Pressable>
                <View style={styles.labelWrapper}>
                    <Pressable onPress={() => handleLabelPress(2)}>
                        <Typography text={t('wine.medium')} variant="h6" style={styles.label} />
                    </Pressable>
                </View>
                <Pressable onPress={() => handleLabelPress(3)}>
                    <Typography text={t('wine.deep')} variant="h6" style={styles.label} />
                </Pressable>
            </View>
        </View>
    );
});

ShadeSelector.displayName = 'ShadeSelector';
