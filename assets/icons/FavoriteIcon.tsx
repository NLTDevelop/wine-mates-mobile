import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    isSaved?: boolean;
}

export const FavoriteIcon = ({ width = 20, height = 20, color, isSaved = false }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || '#910D0D'}
            fill={isSaved ? (color || '#910D0D') : 'none'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.333 14.984V8.09c0-3.028 0-4.542.977-5.482.976-.941 2.547-.941 5.69-.941 3.143 0 4.714 0 5.69.94.977.941.977 2.455.977 5.483v6.894c0 1.922 0 2.883-.644 3.227-1.247.666-3.587-1.556-4.698-2.225-.644-.388-.966-.582-1.325-.582-.358 0-.68.194-1.325.582-1.11.669-3.45 2.89-4.697 2.225-.645-.344-.645-1.305-.645-3.227Z"
        />
    </Svg>
);
