import { Svg, Path, G } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    rotate?: number;
    strokeWidth?: number;
}

export const NextArrowIcon = ({ width = 24, height = 24, color, rotate = 0, strokeWidth = 1.5 }: IProps) => (
    <Svg
        width={scaleVertical(width)}
        height={scaleVertical(height)}
        viewBox="0 0 24 24"
        fill='none'
    >
        <G transform={`rotate(${rotate} 12 12)`}>
            <Path
                stroke={color || '#747474'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={strokeWidth}
                d="m9 18 5.293-5.293c.333-.333.5-.5.5-.707 0-.207-.167-.374-.5-.707L9 6"
            />
        </G>
    </Svg>
);
