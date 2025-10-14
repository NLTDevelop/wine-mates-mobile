import Svg, { G, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    rotate?: number; // 0 | 90 | 180 | 270
    strokeWidth?: number; // 1.5 | 2 | 3
}

export const ArrowDownIcon = ({
    width = 24,
    height = 24,
    color = '#141B34',
    rotate = 0,
    strokeWidth = 1.5,
}: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <G transform={`rotate(${rotate} 12 12)`}>
            <Path
                d="M6 9l5.293 5.293c.333.333.5.5.707.5.207 0 .374-.167.707-.5L18 9"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </G>
    </Svg>
);
