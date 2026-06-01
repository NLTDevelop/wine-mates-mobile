import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const CommentIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6.666 11.25h6.667M6.666 7.083H10"
        />
        <Path
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M5.082 15.834c-1.083-.107-1.895-.432-2.44-.976-.975-.977-.975-2.548-.975-5.69V8.75c0-3.143 0-4.714.976-5.69.976-.977 2.547-.977 5.69-.977h3.333c3.143 0 4.715 0 5.69.976.977.977.977 2.548.977 5.69v.417c0 3.143 0 4.714-.976 5.69-.976.977-2.548.977-5.69.977-.468.01-.84.046-1.205.13-.999.23-1.923.74-2.837 1.186-1.302.635-1.954.952-2.362.655-.782-.582-.018-2.386.154-3.221"
        />
    </Svg>
);
