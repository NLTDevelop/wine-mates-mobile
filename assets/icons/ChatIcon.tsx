import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ChatIcon = ({ width = 24, height = 24, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3.086 17.509a2 2 0 0 0-.094-1.167A10 10 0 1 1 7.77 21.06a2 2 0 0 0-1.099-.092l-3.413.998a1 1 0 0 1-1.236-1.168l1.065-3.29ZM8 12h.01M12 12h.01M16 12h.01"
        />
    </Svg>
);
