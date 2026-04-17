import { Svg, Path, Text } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    bodyColor?: string;
    emojiColor?: string;
    emoji?: string;
}

export const MapMarkerIcon = ({
    width = 42,
    height = 51,
    bodyColor = '#FFFFFF',
    emojiColor = '#000000',
    emoji = '🍷',
}: IProps) => (
    <Svg
        width={scaleVertical(width)}
        height={scaleVertical(height)}
        viewBox="0 0 42 51"
        fill="none"
    >
        <Path
            d="M21 2C11.0589 2 3 10.1401 3 20.1815C3 25.9232 5.25 30.3875 9.75 34.3752C12.9218 37.186 18.6929 43.2154 21 46.9997C23.4239 43.2906 29.0782 37.186 32.25 34.3752C36.75 30.3875 39 25.9232 39 20.1815C39 10.1401 30.9411 2 21 2Z"
            fill={bodyColor}
        />
        <Text
            x="21"
            y="24"
            fontSize="18"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={emojiColor}
        >
            {emoji}
        </Text>
    </Svg>
);
