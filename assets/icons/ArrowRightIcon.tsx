import Svg, { G, Path } from 'react-native-svg';
import { useUiContext } from '@/UIProvider';

interface IProps {
    rotate?: number;
}

export const ArrowRightIcon = ({ rotate = 0 }: IProps) => {
    const { colors } = useUiContext();

    return (
        <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <G transform={`rotate(${rotate} 10 10)`}>
                <Path
                    d="M15.8335 10L3.3335 10"
                    stroke={colors.text}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M12.5 5.83301L15.9596 9.29257C16.2929 9.6259 16.4596 9.79257 16.4596 9.99968C16.4596 10.2068 16.2929 10.3734 15.9596 10.7068L12.5 14.1663"
                    stroke={colors.text}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </G>
        </Svg>
    );
};
