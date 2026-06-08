import { Svg, Path, G, Defs, ClipPath } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
}

export const FacebookIcon = ({ width = 20, height = 20 }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G clipPath="url(#a)">
            <Path
                fill="#0866FF"
                d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.69 3.229 8.625 7.584 9.706v-6.65H5.522V10h2.062V8.683c0-3.403 1.54-4.981 4.882-4.981.634 0 1.727.124 2.174.248v2.77a12.853 12.853 0 0 0-1.155-.037c-1.64 0-2.273.621-2.273 2.236V10h3.266l-.56 3.056h-2.706v6.87C16.164 19.33 20 15.114 20 10Z"
            />
            <Path
                fill="#fff"
                d="M13.916 13.055 14.477 10h-3.266V8.92c0-1.615.634-2.237 2.273-2.237.51 0 .92.013 1.155.038V3.95c-.447-.125-1.54-.249-2.173-.249-3.342 0-4.883 1.578-4.883 4.981V10H5.521v3.056h2.062v6.65a10.018 10.018 0 0 0 3.628.221v-6.87h2.705Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
