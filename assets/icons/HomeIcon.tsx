import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const HomeIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#747474'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12.25 16v6m0-6a5.75 5.75 0 0 1-5.602-7.05c.136-.588.201-1.197.32-1.788l.55-2.75A3 3 0 0 1 10.459 2h3.582a3 3 0 0 1 2.941 2.412l.55 2.75c.119.59.184 1.2.32 1.787A5.75 5.75 0 0 1 12.25 16Zm5 6h-10m-.5-13.053c2.224.23 3.443.087 5.5-1.25 1.931-1.15 3.099-1.076 5.5 1.75"
        />
    </Svg>
);
