import Svg, { Path } from 'react-native-svg';
import { scaleVertical } from '../../utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const InfoIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            fill={color || '#FCFCFC'}
            fillRule="evenodd"
            d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10ZM12 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4Z"
            clipRule="evenodd"
        />
    </Svg>
);
