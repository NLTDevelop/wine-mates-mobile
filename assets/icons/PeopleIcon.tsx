import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const PeopleIcon = ({ width = 40, height = 40, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 40 40" fill="none">
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M26.667 35v-3.333A6.667 6.667 0 0 0 20 25H10a6.667 6.667 0 0 0-6.667 6.667V35M26.666 5.213a6.667 6.667 0 0 1 0 12.907M36.666 35v-3.333a6.667 6.667 0 0 0-5-6.45M15 18.333A6.667 6.667 0 1 0 15 5a6.667 6.667 0 0 0 0 13.333Z"
        />
    </Svg>
);
