import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const LikeIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M16.219 3.328c-2.235-1.37-4.186-.818-5.357.062-.48.36-.72.541-.862.541-.141 0-.382-.18-.862-.541h0c-1.172-.88-3.122-1.432-5.357-.062C.848 5.128.185 11.062 6.949 16.07c1.289.953 1.933 1.43 3.05 1.43 1.118 0 1.763-.477 3.051-1.43 6.765-5.008 6.101-10.943 3.169-12.742Z"
        />
    </Svg>
);
