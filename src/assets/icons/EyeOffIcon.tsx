import Svg, { Path } from 'react-native-svg';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const EyeOffIcon = ({ width, height, color }: IProps) => (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20">
        <Path
            fill={'transparent'}
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M18.333 6.667s-3.333 5-8.333 5-8.333-5-8.333-5"
        />
        <Path
            fill={'transparent'}
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m12.5 11.25 1.25 2.083M16.667 9.167l1.666 1.666M1.667 10.833l1.666-1.666M7.5 11.25l-1.25 2.083"
        />
    </Svg>
);
