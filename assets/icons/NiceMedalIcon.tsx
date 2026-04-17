import { Svg, Path, G, Defs, Text } from 'react-native-svg';
import { scaleFontSize, scaleVertical } from '@/utils';
import { colorTheme } from '@/UIProvider/theme/ColorTheme';

interface IProps {
    width?: number;
    height?: number;
    text: string;
    titleFontSize?: number;
    mainFontSize?: number;
    nameFontSize?: number;
    hideText?: boolean;
}

export const NiceMedalIcon = ({
    width = 32,
    height = 32,
    text,
    titleFontSize,
    mainFontSize,
    nameFontSize,
    hideText = false,
}: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 237 236" fill="none">
        <G filter="url(#a)">
            <Path
                fill="#910D0D"
                d="M.207 115.489C.207 51.706 51.913 0 115.696 0h5.022c63.783 0 115.489 51.706 115.489 115.489s-51.706 115.49-115.489 115.49h-5.022C51.913 230.979.207 179.272.207 115.489Z"
            />
        </G>

        {!hideText && (
            <>
                <Text
                    x="117"
                    y="50"
                    fontSize={scaleFontSize(titleFontSize || 24)}
                    fill={colorTheme.colors.text_inverted}
                    fontFamily="VisueltPro"
                    fontWeight="700"
                    textAnchor="middle"
                >
                    WineMates
                </Text>

                <Text
                    x="117"
                    y="145"
                    fontSize={scaleFontSize(mainFontSize || 90)}
                    fill={colorTheme.colors.text_inverted}
                    fontFamily="VisueltPro"
                    fontWeight="500"
                    textAnchor="middle"
                >
                    {text}
                </Text>

                <Text
                    x="117"
                    y="190"
                    fontSize={scaleFontSize(nameFontSize || 26)}
                    fill={colorTheme.colors.text_inverted}
                    fontFamily="VisueltPro"
                    fontWeight="700"
                    textAnchor="middle"
                >
                    Nice wine
                </Text>
            </>
        )}
        <Defs></Defs>
    </Svg>
);
