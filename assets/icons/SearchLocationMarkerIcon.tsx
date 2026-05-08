import { Circle, Svg } from 'react-native-svg';
import { scaleHorizontal } from '@/utils';

interface IProps {
    color: string;
    borderColor: string;
}

export const SearchLocationMarkerIcon = ({ color, borderColor }: IProps) => {
    return (
        <Svg
            width={scaleHorizontal(18)}
            height={scaleHorizontal(18)}
            viewBox="0 0 18 18"
            fill="none"
        >
            <Circle cx="9" cy="9" r="7.5" fill={color} stroke={borderColor} strokeWidth="3" />
            <Circle cx="9" cy="9" r="3" fill={borderColor} />
        </Svg>
    );
};
