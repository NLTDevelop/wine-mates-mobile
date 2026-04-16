import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const DragIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#747474'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM9 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        />
    </Svg>
);
