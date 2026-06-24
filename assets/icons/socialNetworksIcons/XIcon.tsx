import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
}

export const XIcon = ({ width = 20, height = 20 }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            fill="#000"
            d="M15.273 1.586h2.81l-6.14 7.02 7.224 9.552H13.51l-4.431-5.794-5.07 5.794H1.196l6.57-7.509L.833 1.586h5.8L10.64 6.88l4.633-5.295Zm-.987 14.889h1.558L5.788 3.18H4.117l10.169 13.295Z"
        />
    </Svg>
);
