import { Svg, Path, Text } from 'react-native-svg';
import { scaleFontSize, scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    text: string;
    titleFontSize?: number;
    mainFontSize?: number;
    nameFontSize?: number;
    hideText?: boolean;
}

export const WeakMedalIcon = ({
    width = 237,
    height = 232,
    text,
    titleFontSize,
    mainFontSize,
    nameFontSize,
    hideText = false,
}: IProps) => {
    const w = scaleVertical(width);
    const h = scaleVertical(height);

    return (
        <Svg width={w} height={h} viewBox="0 0 237 232">
            <Path
                d="M0 116C0 52 52 0 116 0h5c64 0 116 52 116 116s-52 116-116 116h-5C52 232 0 180 0 116z"
                fill="#F5F5F5"
            />

            {!hideText && (
                <>
                    <Text
                        x="118"
                        y="50"
                        fontSize={scaleFontSize(titleFontSize || 24)}
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
                        fontSize={scaleFontSize(mainFontSize || 90)}
                        fill="#6F6F6F"
                        fontFamily="VisueltPro"
                        fontWeight="500"
                        textAnchor="middle"
                    >
                        {text}
                    </Text>

                    <Text
                        x="118"
                        y="190"
                        fontSize={scaleFontSize(nameFontSize || 26)}
                        fill="#6F6F6F"
                        fontFamily="VisueltPro"
                        fontWeight="700"
                        textAnchor="middle"
                    >
                        Weak wine
                    </Text>
                </>
            )}
        </Svg>
    );
};
