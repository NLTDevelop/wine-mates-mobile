import Svg, { Circle, Path } from 'react-native-svg';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ErrorIcon = ({ width, height, color }: IProps) => (
    <Svg width={width || 10} height={height || 10} viewBox="0 0 12 11">
        <Circle fill={'transparent'} cx={6} cy={5.5} r={5} stroke={color || "#C20E0E"} />
        <Path stroke={color || "#C20E0E"} strokeLinecap="round" strokeLinejoin="round" d="M5.996 7H6M6 5.5v-2" />
    </Svg>
);
