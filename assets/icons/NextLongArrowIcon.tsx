import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const NextLongArrowIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#fff'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 12H4M15 7l4.293 4.293c.333.333.5.5.5.707 0 .207-.167.374-.5.707L15 17"
        />
    </Svg>
);
