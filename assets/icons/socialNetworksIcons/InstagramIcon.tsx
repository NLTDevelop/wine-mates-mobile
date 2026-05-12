import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
}

export const InstagramIcon = ({ width = 20, height = 20 }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            fill="url(#a)"
            d="M15.656 0H5.226A5.232 5.232 0 0 0 0 5.227v9.546A5.232 5.232 0 0 0 5.226 20h10.43a5.232 5.232 0 0 0 5.226-5.227V5.227A5.233 5.233 0 0 0 15.656 0ZM1.844 5.227a3.387 3.387 0 0 1 3.382-3.383h10.43a3.387 3.387 0 0 1 3.383 3.383v9.546a3.387 3.387 0 0 1-3.383 3.383H5.226a3.387 3.387 0 0 1-3.382-3.383V5.227Z"
        />
        <Path
            fill="url(#b)"
            d="M10.441 14.861c2.68 0 4.861-2.18 4.861-4.862a4.867 4.867 0 0 0-4.861-4.862c-2.68 0-4.86 2.18-4.86 4.862a4.867 4.867 0 0 0 4.86 4.862Zm0-7.879A3.021 3.021 0 0 1 13.458 10a3.021 3.021 0 0 1-3.017 3.019A3.021 3.021 0 0 1 7.424 10a3.021 3.021 0 0 1 3.017-3.018Z"
        />
        <Path fill="url(#c)" d="M15.751 5.921a1.31 1.31 0 1 0-.002-2.62 1.31 1.31 0 0 0 .002 2.62Z" />
        <Defs>
            <LinearGradient id="a" x1={1.754} x2={19.132} y1={18.689} y2={1.316} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#FAAD4F" />
                <Stop offset={0.35} stopColor="#DD2A7B" />
                <Stop offset={0.62} stopColor="#9537B0" />
                <Stop offset={1} stopColor="#515BD4" />
            </LinearGradient>
            <LinearGradient id="b" x1={7.006} x2={13.877} y1={13.437} y2={6.566} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#FAAD4F" />
                <Stop offset={0.35} stopColor="#DD2A7B" />
                <Stop offset={0.62} stopColor="#9537B0" />
                <Stop offset={1} stopColor="#515BD4" />
            </LinearGradient>
            <LinearGradient id="c" x1={14.825} x2={16.678} y1={5.537} y2={3.685} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#FAAD4F" />
                <Stop offset={0.35} stopColor="#DD2A7B" />
                <Stop offset={0.62} stopColor="#9537B0" />
                <Stop offset={1} stopColor="#515BD4" />
            </LinearGradient>
        </Defs>
    </Svg>
);
