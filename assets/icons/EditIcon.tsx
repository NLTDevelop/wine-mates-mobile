import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const EditIcon = ({ width = 20, height = 20, color = '#000' }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.25}
            d="M10 16.666h7.5m-3.75-13.75a1.768 1.768 0 0 1 2.5 2.5L5.833 15.833l-3.333.833.833-3.333L13.75 2.916Z"
        />
    </Svg>
);
