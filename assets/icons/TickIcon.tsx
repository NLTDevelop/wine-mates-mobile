import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const TickIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            fill={color || '#000'}
            fillRule="evenodd"
            d="M18.538 7.478a.75.75 0 0 1-.016 1.06l-8.25 8a.75.75 0 0 1-1.044 0l-3.75-3.636a.75.75 0 0 1 1.044-1.077l3.228 3.13 7.728-7.493a.75.75 0 0 1 1.06.016Z"
            clipRule="evenodd"
        />
    </Svg>
);
