import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ShareIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#1E1E1E'}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m10 3V3h-6m6 0L10 14"
        />
    </Svg>
);
