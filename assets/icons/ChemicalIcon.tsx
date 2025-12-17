import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ChemicalIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#141B34'}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M21 21H10c-3.3 0-4.95 0-5.975-1.025C3 18.95 3 17.3 3 14V3"
        />
        <Path
            stroke={color || '#141B34'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.5 19.5 21 3"
        />
        <Path
            stroke={color || '#141B34'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 4h.009M8 3h.009M8 9h.009M20 11h.009M13 17h.009"
        />
    </Svg>
);
