import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const FollowersIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M18.616 20h.49c1.15 0 2.065-.524 2.886-1.256C24.078 16.883 19.174 15 17.5 15m-2-9.931c.227-.045.463-.069.705-.069 1.82 0 3.295 1.343 3.295 3s-1.475 3-3.295 3c-.242 0-.478-.024-.705-.069"
        />
        <Path
            stroke={color || '#000'}
            strokeWidth={1.5}
            d="M4.481 16.111c-1.179.632-4.27 1.922-2.387 3.536.92.789 1.944 1.353 3.232 1.353h7.348c1.288 0 2.312-.564 3.232-1.353 1.883-1.614-1.208-2.904-2.387-3.536-2.765-1.481-6.273-1.481-9.038 0ZM13 7.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        />
    </Svg>
);
