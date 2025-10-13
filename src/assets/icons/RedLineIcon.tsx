import Svg, { Path } from 'react-native-svg';
import { scaleVertical } from '../../utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const RedLineIcon = ({ width = 601, height = 139, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 375 141" fill="none">
        <Path
            stroke={color || '#910D0D'}
            strokeLinecap="round"
            strokeWidth={2}
            d="M-118 13.79c3.379-1.635 11.273-4.254 19.21-6.883C-82.223 1.419-37.867.004-16.467 1.639 4.69 3.255 42.573 15.384 55.144 20.505c10.324 4.204 24.303 12.623 58.411 33.532 15.283 9.37 34.583 24.444 53.097 36.201 18.513 11.757 34.761 20.206 45.932 25.533 16.18 7.715 35.432 11.884 72.604 17.123 24.01 3.383 59.582 5.238 83.928 6.415 36.573 1.768 53.852-.133 66.806-2.58 20.797-4.721 36.297-9.034 41.382-11.328 2.284-.995 3.964-1.645 5.696-2.314"
        />
    </Svg>
);
