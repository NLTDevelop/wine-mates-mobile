import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    rotate?: number;
}

export const NextArrowIcon = ({ width = 24, height = 24, color, rotate = 0 }: IProps) => (
    <Svg
        width={scaleVertical(width)}
        height={scaleVertical(height)}
        viewBox="0 0 24 24"
        fill='none'
        rotation={rotate}
    >
        <Path
            stroke={color || '#747474'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m9 18 5.293-5.293c.333-.333.5-.5.5-.707 0-.207-.167-.374-.5-.707L9 6"
        />
    </Svg>
);
