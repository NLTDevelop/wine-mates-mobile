import Svg, { G, Path } from 'react-native-svg';
import { useUiContext } from '@/UIProvider';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const EmptyWineIcon = ({ width = 140, height = 74, color }: IProps) => {
    const { colors } = useUiContext();
    const fillColor = color || colors.border;

    return (
        <Svg
            width={scaleVertical(width)}
            height={scaleVertical(height)}
            viewBox="0 0 1408 736"
            preserveAspectRatio="xMidYMid meet"
        >
            <G transform="translate(0, 736) scale(0.1, -0.1)" fill={fillColor}>
                <Path d="M6930 7014 c-8 -1 -36 -6 -62 -9 -30 -4 -59 -16 -78 -31 -36 -31 -37 -42 -14 -278 13 -123 14 -171 6 -174 -6 -2 -22 -12 -36 -23 -20 -16 -26 -30 -26 -59 0 -22 -9 -54 -20 -72 -35 -58 -26 -208 15 -243 9 -7 10 -43 4 -135 -4 -69 -15 -327 -24 -575 -8 -247 -20 -466 -25 -485 -16 -58 -63 -122 -140 -191 -147 -131 -247 -283 -292 -446 l-22 -78 3 -1800 c1 -1073 6 -1815 12 -1836 19 -75 101 -157 179 -179 75 -22 266 -42 469 -49 349 -13 714 14 823 61 59 25 119 89 144 154 18 48 19 103 19 1859 l0 1810 -23 75 c-50 158 -126 276 -259 399 -178 166 -177 163 -192 571 -6 173 -16 431 -22 572 -11 254 -11 258 10 284 30 38 31 194 1 239 -11 17 -20 47 -20 67 0 38 -16 62 -50 73 -11 3 -20 9 -20 13 1 4 9 93 20 197 20 206 18 221 -30 257 -15 10 -56 22 -100 28 -70 9 -217 12 -250 4z" />
            </G>
        </Svg>
    );
};
