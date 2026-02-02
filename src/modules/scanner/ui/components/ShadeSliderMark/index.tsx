import { useMemo } from 'react';
import { View, Animated } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';

interface IProps {
  size: number;
  innerSize: number;
  selectedColor: string | Animated.AnimatedInterpolation<string | number>;
  trackHeight: number;
}

export const ShadeSliderMark = ({ size, innerSize, selectedColor, trackHeight }: IProps) => {
  const { colors } = useUiContext();
  const styles = useMemo(
    () => getStyles(colors, size, innerSize, trackHeight),
    [colors, size, innerSize, trackHeight],
  );

  return (
    <View style={styles.marker}>
      <Animated.View style={[styles.markerInner, { backgroundColor: selectedColor }]} />
    </View>
  );
};
