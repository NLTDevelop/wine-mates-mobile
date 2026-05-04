import { Svg, Path, G, Defs, ClipPath } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const FacebookIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G clipPath="url(#a)">
            <Path
                fill={color || '#000'}
                d="M10 0C4.477 0 0 4.477 0 10c0 4.69 3.229 8.625 7.584 9.706v-6.65H5.522V10h2.062V8.683c0-3.403 1.54-4.981 4.882-4.981.634 0 1.727.124 2.174.248v2.77a12.853 12.853 0 0 0-1.155-.037c-1.64 0-2.273.621-2.273 2.236V10h3.266l-.56 3.056h-2.706v6.87C16.164 19.33 20 15.114 20 10c0-5.523-4.477-10-10-10Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
