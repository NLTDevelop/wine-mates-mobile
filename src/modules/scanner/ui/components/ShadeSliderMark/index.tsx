import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';

interface IProps {
  size: number;
  innerSize: number;
  selectedColor: string;
  trackHeight: number;
}

export const ShadeSliderMark = ({ size, innerSize, selectedColor, trackHeight }: IProps) => {
  const { colors } = useUiContext();
  const styles = useMemo(
    () => getStyles(colors, size, innerSize, selectedColor, trackHeight),
    [colors, size, innerSize, selectedColor, trackHeight],
  );

  return (
    <View style={styles.marker}>
      <View style={styles.markerInner} />
    </View>
  );
};
