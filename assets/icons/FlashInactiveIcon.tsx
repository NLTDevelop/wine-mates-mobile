import { Svg, Path, G, Defs, ClipPath } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const FlashInactiveIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G stroke={color || '#000'} strokeLinecap="round" strokeWidth={1.5} clipPath="url(#a)">
            <Path
                strokeLinejoin="round"
                d="m13.333 13.334-3.61 4.71c-.45.586-1.29.222-1.29-.558v-5.794c0-.467-.33-.846-.737-.846H4.905c-.634 0-.972-.858-.553-1.404l2.126-2.775M8.333 4.773l2.081-2.814c.438-.592 1.258-.224 1.258.565v5.859c0 .472.322.855.719.855h2.722c.619 0 .948.868.54 1.42l-.746 1.009"
            />
            <Path d="m1.667 1.667 16.666 16.667" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill={color || '#000'} d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
