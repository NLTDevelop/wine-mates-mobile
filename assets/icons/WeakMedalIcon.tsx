import { Svg, Path, Text } from 'react-native-svg';
import { scaleFontSize, scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    text: string;
}

export const WeakMedalIcon = ({ width = 237, height = 232, text }: IProps) => {
    const w = scaleVertical(width);
    const h = scaleVertical(height);

    return (
        <Svg width={w} height={h} viewBox="0 0 237 232">
            <Path
                d="M0 116C0 52 52 0 116 0h5c64 0 116 52 116 116s-52 116-116 116h-5C52 232 0 180 0 116z"
                fill="#F5F5F5"
            />

            <Text
                x="118"
                y="56"
                fontSize={scaleFontSize(24)}
                fill="#6F6F6F"
                fontFamily="VisueltPro"
                fontWeight="700"
                textAnchor="middle"
            >
                WineMates
            </Text>

            <Text
                x="118"
                y="145"
                fontSize={scaleFontSize(96)}
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
                fontSize={scaleFontSize(28)}
                fill="#6F6F6F"
                fontFamily="VisueltPro"
                fontWeight="700"
                textAnchor="middle"
            >
                Weak wine
            </Text>
        </Svg>
    );
};
