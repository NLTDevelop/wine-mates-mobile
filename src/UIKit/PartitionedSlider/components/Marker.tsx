import { View, ViewStyle } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { scaleHorizontal, scaleVertical } from '@/utils';

interface MarkerProps {
    size?: number;
    color?: string;
    style?: ViewStyle;
}

export const Marker = ({ size = 20, color, style }: MarkerProps) => {
    const { colors } = useUiContext();
    const actualSize = scaleHorizontal(size);
    const actualColor = color || colors.primary;

    return (
        <View
            style={[
                {
                    width: actualSize,
                    height: actualSize,
                    borderRadius: actualSize / 2,
                    backgroundColor: actualColor,
                    shadowColor: colors.text,
                    shadowOffset: {
                        width: 0,
                        height: scaleVertical(2),
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                },
                style,
            ]}
        />
    );
};
