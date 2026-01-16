import { Svg, Path, G, Defs, ClipPath } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const SearchIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G stroke={color || "#141B34"} strokeLinejoin="round" strokeWidth={1.5} clipPath="url(#a)">
            <Path strokeLinecap="round" d="m14.584 14.583 3.75 3.75" />
            <Path d="M16.667 9.167a7.5 7.5 0 1 0-15 0 7.5 7.5 0 0 0 15 0Z" />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="none" d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
