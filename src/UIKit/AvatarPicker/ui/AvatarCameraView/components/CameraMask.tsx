import { useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Defs, Mask as SvgMask, Rect, Circle } from 'react-native-svg';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    circleSize: number;
}

export const CameraMask = ({ circleSize }: IProps) => {
    const { colors } = useUiContext();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const radius = circleSize / 2;

    const styles = useMemo(() => getStyles(colors, circleSize, screenWidth, screenHeight), [colors, circleSize, screenWidth, screenHeight]);

    return (
        <View style={styles.container} pointerEvents="none">
            <Svg width={screenWidth} height={screenHeight} style={styles.svgContainer}>
                <Defs>
                    <SvgMask id="mask">
                        <Rect x="0" y="0" width={screenWidth} height={screenHeight} fill="white" />
                        <Circle cx={centerX} cy={centerY} r={radius} fill="black" />
                    </SvgMask>
                </Defs>
                <Rect
                    x="0"
                    y="0"
                    width={screenWidth}
                    height={screenHeight}
                    fill="rgba(0, 0, 0, 0.6)"
                    mask="url(#mask)"
                />
            </Svg>
            <View style={styles.circleBorder} />
        </View>
    );
};
