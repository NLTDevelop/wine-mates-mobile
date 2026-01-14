import { scaleVertical } from '@/utils';
import { View } from 'react-native';
import { Svg, Path, Defs, ClipPath, Rect } from 'react-native-svg';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    outlineColor?: string;
}

const EMPTY_STAR_PATH = `m22.88 5.74 2.932 5.915c.4.823 1.467 1.613 2.366 1.764l5.317.89c3.4.572 4.2 3.058 1.75 5.511l-4.133 4.168c-.7.705-1.084 2.066-.867 3.04l1.183 5.16c.933 4.082-1.216 5.662-4.8 3.528l-4.982-2.974c-.9-.538-2.383-.538-3.3 0l-4.982 2.974c-3.567 2.134-5.733.537-4.8-3.529l1.183-5.158c.217-.975-.166-2.336-.866-3.041L4.748 19.82c-2.433-2.453-1.65-4.94 1.75-5.51l5.316-.891c.883-.152 1.95-.941 2.35-1.764l2.932-5.915c1.6-3.21 4.2-3.21 5.783 0Z`;

export const HalfStarIcon = ({ width = 40, height = 40, color = '#ECC024', outlineColor = '#000' }: IProps) => {
    const w = scaleVertical(width);
    const h = scaleVertical(height);

    return (
        <View style={{ width: w, height: h }}>
            {/* LEFT HALF FILL */}
            <Svg width={w} height={h} viewBox="0 0 40 40" style={{ position: 'absolute' }}>
                <Defs>
                    <ClipPath id="halfClip">
                        <Rect x="0" y="0" width={w / 2} height={h} />
                    </ClipPath>
                </Defs>

                <Path d={EMPTY_STAR_PATH} fill={color} clipPath="url(#halfClip)" />
            </Svg>

            {/* OUTLINE SAME AS EMPTY STAR */}
            <Svg width={w} height={h} viewBox="0 0 40 40" style={{ position: 'absolute' }}>
                <Path
                    d={EMPTY_STAR_PATH}
                    fill="none"
                    stroke={outlineColor}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                />
            </Svg>
        </View>
    );
};
