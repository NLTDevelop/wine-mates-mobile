import Svg, { Path } from 'react-native-svg';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const EyeIcon = ({ width, height, color }: IProps) => (
    <Svg width={width || 24} height={height || 24} viewBox="0 0 24 24">
        <Path fill={'transparent'} stroke={color || "#000"} strokeWidth={1.5} d="M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z" />
        <Path fill={'transparent'} stroke={color || "#000"} strokeWidth={1.5} d="M12 5c5.523 0 10 7 10 7s-4.477 7-10 7-10-7-10-7 4.477-7 10-7Z" />
    </Svg>
);
