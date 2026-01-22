import { Svg, Path } from 'react-native-svg';
import { scaleVertical } from '@/utils';

interface IProps {
    width?: number;
    height?: number;
    color?: string;
    isOutline?: boolean;
}

export const InfoIcon = ({ width = 24, height = 24, color, isOutline = false }: IProps) => (
    <Svg width={scaleVertical(width)} height={scaleVertical(height)} viewBox="0 0 24 24" fill="none">
        {isOutline ? (
            <>
                <Path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke={color || '#747474'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M12 8V12"
                    stroke={color || '#747474'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M12 16H12.01"
                    stroke={color || '#747474'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </>
        ) : (
            <Path
                fill={color || '#FCFCFC'}
                fillRule="evenodd"
                d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10ZM12 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Zm1 5a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4Z"
                clipRule="evenodd"
            />
        )}
    </Svg>
);
