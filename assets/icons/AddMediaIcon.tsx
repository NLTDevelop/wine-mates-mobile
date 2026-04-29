import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const AddMediaIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m1 14 4.47-4.47a1.81 1.81 0 0 1 2.56 0L12 13.5m0 0 1.5 1.5M12 13.5l1.97-1.97a1.81 1.81 0 0 1 2.56 0L19 14"
        />
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 .5C5.77.5 3.655.5 2.253 1.698c-.2.17-.385.356-.555.555C.5 3.655.5 5.77.5 10s0 6.345 1.198 7.747c.17.2.356.385.555.555C3.655 19.5 5.77 19.5 10 19.5s6.345 0 7.747-1.198c.2-.17.385-.356.555-.555C19.5 16.345 19.5 14.23 19.5 10m0-6H16m0 0h-3.5M16 4V.5M16 4v3.5"
        />
    </Svg>
);
