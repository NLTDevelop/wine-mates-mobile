import { Svg, Circle, Text } from 'react-native-svg';
import { scaleFontSize, scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    text: string;
}

export const SimpleMedalIcon = ({
                                    width = 237,
                                    height = 232,
                                    text,
                                }: IProps) => {
    const w = scaleVertical(width);
    const h = scaleVertical(height);
    const fontSize = width * 1.75;

    return (
        <Svg width={w} height={h} viewBox="0 0 237 232">
            <Circle cx="118" cy="116" r="116" fill="#EBEBEB" />

            <Text
                x="118"
                y="60"
                fontSize={scaleFontSize(fontSize * 0.2)}
                fill="#6F6F6F"
                fontFamily="VisueltPro"
                fontWeight="700"
                textAnchor="middle"
            >
                WineMates
            </Text>

            <Text
                x="118"
                y="146"
                fontSize={scaleFontSize(fontSize * 0.8)}
                fill="#6F6F6F"
                fontFamily="VisueltPro"
                fontWeight="500"
                textAnchor="middle"
            >
                {text}
            </Text>

            <Text
                x="118"
                y="195"
                fontSize={scaleFontSize(fontSize * 0.3)}
                fill="#6F6F6F"
                fontFamily="VisueltPro"
                fontWeight="700"
                textAnchor="middle"
            >
                Simple
            </Text>
        </Svg>
    );
};
