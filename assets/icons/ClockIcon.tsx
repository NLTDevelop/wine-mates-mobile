import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ClockIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || "#747474"}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 18.334a8.333 8.333 0 1 0 0-16.667 8.333 8.333 0 0 0 0 16.667Z"
        />
        <Path stroke={color || "#747474"} strokeLinecap="round" strokeLinejoin="round" d="M10 5v5H6.667" />
    </Svg>
);
