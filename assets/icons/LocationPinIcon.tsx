import { Svg, Path } from 'react-native-svg';
import { useUiContext } from '@/UIProvider';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const LocationPinIcon = ({ width = 16, height = 16, color }: IProps) => {
    const { colors } = useUiContext();
    const strokeColor = color || colors.primary;

    return (
        <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 16 16" fill="none">
            <Path
                d="M10.3332 7.33333C10.3332 8.622 9.2885 9.66667 7.99984 9.66667C6.71117 9.66667 5.6665 8.622 5.6665 7.33333C5.6665 6.04467 6.71117 5 7.99984 5C9.2885 5 10.3332 6.04467 10.3332 7.33333Z"
                stroke={strokeColor}
            />
            <Path
                d="M8 1.33301C11.247 1.33301 14 4.02166 14 7.28352C14 10.5973 11.2022 12.9228 8.618 14.5041C8.42967 14.6104 8.2167 14.6663 8 14.6663C7.7833 14.6663 7.57033 14.6104 7.382 14.5041C4.8026 12.9074 2 10.6088 2 7.28352C2 4.02166 4.75296 1.33301 8 1.33301Z"
                stroke={strokeColor}
            />
        </Svg>
    );
};
