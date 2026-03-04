import { Svg, Circle } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    opacity?: number;
}

export const MarqueeDividerIcon = ({ width = 4, height = 4, color = '#FFFFFF', opacity = 0.5 }: IProps) => (
    <Svg
        width={scaleVertical(width)}
        height={scaleVertical(height)}
        viewBox="0 0 4 4"
        fill="none"
    >
        <Circle cx="2" cy="2" r="2" fill={color} fillOpacity={opacity} />
    </Svg>
);
