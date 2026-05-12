import { Svg, Path, G, Defs, ClipPath } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
}

export const LinkedInIcon = ({ width = 20, height = 20 }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G clipPath="url(#a)">
            <Path
                fill="#0A66C2"
                d="M18.524 0H1.476A1.476 1.476 0 0 0 0 1.476v17.048A1.476 1.476 0 0 0 1.476 20h17.048A1.476 1.476 0 0 0 20 18.524V1.476A1.476 1.476 0 0 0 18.524 0ZM5.96 17.038H2.954V7.486h3.007v9.552ZM4.456 6.162a1.726 1.726 0 1 1 1.736-1.724 1.702 1.702 0 0 1-1.736 1.724Zm12.588 10.884H14.04v-5.218c0-1.54-.654-2.014-1.499-2.014-.891 0-1.766.672-1.766 2.053v5.179H7.767V7.493h2.891v1.324h.04c.29-.588 1.306-1.592 2.858-1.592 1.677 0 3.49.996 3.49 3.912l-.002 5.909Z"
            />
        </G>
        <Defs>
            <ClipPath id="a">
                <Path fill="#fff" d="M0 0h20v20H0z" />
            </ClipPath>
        </Defs>
    </Svg>
);
