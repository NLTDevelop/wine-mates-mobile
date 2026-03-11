import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const MapLocationIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M22 10V5H15L8.01175 2.00098L2 5.08297V19L8.01175 17L11 18.2827"
            stroke={color || '#000'}
            strokeWidth={1.5}
            strokeLinejoin="round"
        />
        <Path
            d="M8 2L8 17"
            stroke={color || '#000'}
            strokeWidth={1.5}
            strokeLinejoin="round"
        />
        <Path
            d="M15 5V9.5"
            stroke={color || '#000'}
            strokeWidth={1.5}
            strokeLinejoin="round"
        />
        <Path
            d="M22 16.5C22 20 17.5 22 17.5 22C17.5 22 13 20 13 16.5C13 14.0147 15.0147 12 17.5 12C19.9853 12 22 14.0147 22 16.5Z"
            stroke={color || '#000'}
            strokeWidth={1.5}
        />
        <Path
            d="M17.5 16.5H17.509"
            stroke={color || '#000'}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
