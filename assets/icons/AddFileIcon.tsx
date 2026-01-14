import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const AddFileIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 2h.273c3.26 0 4.892 0 6.024.798.324.228.612.5.855.805.848 1.066.848 2.6.848 5.67v2.545c0 2.963 0 4.445-.469 5.628-.754 1.903-2.348 3.403-4.37 4.113-1.257.441-2.83.441-5.98.441-1.798 0-2.698 0-3.416-.252-1.155-.406-2.066-1.263-2.497-2.35C4 18.722 4 17.875 4 16.182V12"
        />
        <Path
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 12a3.333 3.333 0 0 1-3.333 3.333c-.666 0-1.451-.116-2.098.057a1.667 1.667 0 0 0-1.179 1.179c-.173.647-.057 1.432-.057 2.098A3.333 3.333 0 0 1 11 22"
        />
        <Path stroke={color || '#000'} strokeLinecap="round" strokeWidth={1.5} d="M11 6H3m4-4v8" />
    </Svg>
);
