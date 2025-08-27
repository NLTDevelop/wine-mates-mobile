import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

interface IProps {
    width?: number;
    height?: number;
}

export const GoogleIcon = ({ width, height }: IProps) => (
    <Svg width={width || 24} height={height || 24} viewBox="0 0 24 24">
        <G fillRule="evenodd" clipPath="url(#a)" clipRule="evenodd">
            <Path
                fill="#FBBC05"
                d="M5.172 12c0-.78.13-1.527.36-2.228L1.489 6.684A11.994 11.994 0 0 0 .256 12c0 1.91.444 3.713 1.23 5.312l4.043-3.094A7.099 7.099 0 0 1 5.172 12Z"
            />
            <Path
                fill="#EA4335"
                d="M12.273 4.91c1.694 0 3.223.6 4.425 1.58L20.193 3c-2.13-1.855-4.86-3-7.92-3-4.749 0-8.83 2.716-10.785 6.684l4.045 3.088a7.082 7.082 0 0 1 6.74-4.863Z"
            />
            <Path
                fill="#34A853"
                d="M12.273 19.091a7.082 7.082 0 0 1-6.74-4.863l-4.045 3.088A11.98 11.98 0 0 0 12.273 24c2.931 0 5.73-1.04 7.83-2.99l-3.839-2.969c-1.083.683-2.447 1.05-3.99 1.05Z"
            />
            <Path
                fill="#4285F4"
                d="M23.744 12c0-.709-.11-1.473-.273-2.182H12.273v4.637h6.446c-.323 1.58-1.2 2.796-2.455 3.586l3.839 2.968c2.206-2.047 3.64-5.098 3.64-9.009Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h24v24H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
