import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ToastErrorIcon = ({ width = 32, height = 32, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 32 32" fill="none">
        <Path
            fill={color || '#fff'}
            d="M16 3a13 13 0 1 0 13 13A13.013 13.013 0 0 0 16 3Zm-1 7a1 1 0 0 1 2 0v7a1 1 0 0 1-2 0v-7Zm1 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"
        />
    </Svg>
);
