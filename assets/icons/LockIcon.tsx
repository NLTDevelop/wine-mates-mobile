import { Svg, Path, Rect } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const LockIcon = ({ width = 32, height = 32, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 32 32" fill="none">
        <Rect width={31} height={31} x={0.5} y={0.5} fill="#fff" rx={15.5} />
        <Rect width={31} height={31} x={0.5} y={0.5} stroke={color || '#910D0D'} rx={15.5} />
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 19.334v-1.667"
        />
        <Path
            stroke={color || '#910D0D'}
            strokeWidth={1.5}
            d="M10.166 18.5a5.833 5.833 0 1 1 11.667 0 5.833 5.833 0 0 1-11.666 0Z"
        />
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M19.75 13.917v-2.5a3.75 3.75 0 1 0-7.5 0v2.5"
        />
    </Svg>
);
