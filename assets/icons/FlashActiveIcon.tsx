import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const FlashActiveIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            d="M13.3 13.3 9.7 18c-.45.6-1.3.25-1.3-.53v-5.82c0-.47-.33-.85-.74-.85H4.9c-.63 0-.97-.86-.55-1.41l2.13-2.77 1.85-1.9 2.08-2.81c.44-.59 1.26-.22 1.26.56v5.85c0 .47.32.86.72.86h2.72c.62 0 .95.87.54 1.42l-.75 1-1.6 1.63"
            stroke={color || '#000'}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);
