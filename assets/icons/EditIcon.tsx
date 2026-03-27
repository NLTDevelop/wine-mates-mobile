import { Svg, Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
}

export const EditIcon = ({ width = 20, height = 20, color = '#000' }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 20 20" fill="none">
        <G clipPath="url(#clip0)">
            <Path
                d="M11.7274 3.2382C12.3484 2.56539 12.6589 2.22899 12.9889 2.03276C13.785 1.55929 14.7653 1.54457 15.5746 1.99393C15.9101 2.18016 16.2301 2.50709 16.8702 3.16096C17.5103 3.81483 17.8303 4.14176 18.0126 4.48443C18.4525 5.31126 18.4381 6.31265 17.9746 7.12591C17.7825 7.46296 17.4532 7.78014 16.7946 8.4145L8.9582 15.9622C7.71008 17.1644 7.08602 17.7655 6.30607 18.0701C5.52612 18.3747 4.66868 18.3523 2.95382 18.3075L2.7205 18.3014C2.19844 18.2877 1.93741 18.2809 1.78567 18.1087C1.63393 17.9365 1.65465 17.6706 1.69608 17.1388L1.71858 16.85C1.83519 15.3533 1.89349 14.6049 2.18577 13.9322C2.47805 13.2594 2.98221 12.7132 3.99054 11.6207L11.7274 3.2382Z"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M10.833 3.33301L16.6663 9.16634"
                stroke={color}
                strokeWidth={1.5}
                strokeLinejoin="round"
            />
            <Path
                d="M11.666 18.333L18.3327 18.333"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </G>
        <Defs>
            <ClipPath id="clip0">
                <Rect width="20" height="20" fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
);

