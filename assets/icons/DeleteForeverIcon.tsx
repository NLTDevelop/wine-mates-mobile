import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const DeleteForeverIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.2}
            d="M8.334 9.166v5M11.666 9.166v5M15.833 5v11.667a1.667 1.667 0 0 1-1.667 1.666H5.833a1.667 1.667 0 0 1-1.667-1.666V5M2.5 5h15M6.666 5V3.332a1.667 1.667 0 0 1 1.667-1.667h3.333a1.667 1.667 0 0 1 1.667 1.667v1.666"
        />
    </Svg>
);
