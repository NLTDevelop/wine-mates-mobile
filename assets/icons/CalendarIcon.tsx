import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const CalendarIcon = ({ width = 20, height = 20, color }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <Path
            stroke={color || '#747474'}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 1.667v1.667M5 1.667v1.667M9.996 10.834h.008m-.008 3.333h.008m3.322-3.333h.007m-6.667 0h.008m-.008 3.333h.008M2.917 6.667h14.166M2.083 10.203c0-3.631 0-5.447 1.044-6.575C4.17 2.5 5.849 2.5 9.208 2.5h1.584c3.358 0 5.038 0 6.081 1.128 1.044 1.128 1.044 2.944 1.044 6.575v.428c0 3.63 0 5.446-1.044 6.574-1.043 1.128-2.723 1.128-6.081 1.128H9.208c-3.359 0-5.038 0-6.081-1.128-1.044-1.128-1.044-2.943-1.044-6.574v-.428ZM2.5 6.667h15"
        />
    </Svg>
);
