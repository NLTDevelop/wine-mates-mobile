import Svg, { Path } from 'react-native-svg';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const ArrowIcon = ({ width, height, color }: IProps) => (
    <Svg width={width || 20} height={height || 20} viewBox="0 0 20 20">
        <Path
            stroke={color || '#000'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.167 10h12.5M7.5 14.167l-3.46-3.46c-.333-.333-.5-.5-.5-.707 0-.207.167-.374.5-.707l3.46-3.46"
        />
    </Svg>
);
