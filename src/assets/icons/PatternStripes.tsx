import { Svg, Line } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
  width: number;
  color: string;
}

export const PatternStripes = ({ width, color }: IProps) => {
  const height = scaleVertical(16);
  const strokeW = 3;
  const spacing = 14;
  const angleOffset = height * 0.5;

  const stripes: React.ReactNode[] = [];
  for (let x = -angleOffset; x < width + angleOffset; x += spacing) {
    stripes.push(
      <Line
        key={x}
        x1={x}
        y1={height}
        x2={x + angleOffset}
        y2={0}
        stroke={color}
        strokeWidth={strokeW}
        strokeOpacity={0.18}
      />
    );
  }

  return (
    <Svg width={width} height={height}>
      {stripes}
    </Svg>
  );
};
