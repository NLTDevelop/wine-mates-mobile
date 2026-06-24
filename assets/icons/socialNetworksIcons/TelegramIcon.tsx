import { Svg, Path, G, Defs, ClipPath, LinearGradient, Stop } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
}

export const TelegramIcon = ({ width = 20, height = 20 }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G clipPath="url(#a)">
            <Path fill="url(#b)" d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Z" />
            <Path
                fill="#fff"
                fillRule="evenodd"
                d="M4.526 9.894c2.915-1.27 4.859-2.107 5.832-2.512 2.777-1.155 3.354-1.356 3.73-1.362.083-.002.268.019.387.116a.421.421 0 0 1 .143.27c.013.079.03.256.016.394-.15 1.582-.801 5.419-1.133 7.19-.14.75-.416 1-.683 1.025-.58.053-1.022-.384-1.584-.752-.88-.577-1.377-.937-2.232-1.5-.987-.65-.347-1.008.216-1.592.147-.153 2.706-2.48 2.755-2.691.006-.027.012-.125-.046-.177-.059-.052-.145-.034-.207-.02-.089.02-1.495.949-4.219 2.788-.399.274-.76.407-1.084.4-.357-.008-1.044-.202-1.554-.368-.627-.203-1.124-.31-1.081-.656.022-.18.27-.365.744-.553Z"
                clipRule="evenodd"
            />
        </G>
        <Defs>
            <LinearGradient id="b" x1={10} x2={10} y1={0} y2={19.852} gradientUnits="userSpaceOnUse">
                <Stop stopColor="#2AABEE" />
                <Stop offset={1} stopColor="#229ED9" />
            </LinearGradient>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
