import { ViewStyle } from 'react-native';
import { scaleVertical } from '@/utils';
import { IColors } from '@/UIProvider/theme/IColors';

export const getShadows = (colors: IColors) => {
    const shadows: Record<string, ViewStyle> = {
        small: {
            shadowColor: colors.shadow,
            shadowOffset: {
                width: 0,
                height: scaleVertical(1),
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        medium: {
            shadowColor: colors.shadow,
            shadowOffset: {
                width: 0,
                height: scaleVertical(2),
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        large: {
            shadowColor: colors.shadow,
            shadowOffset: {
                width: 0,
                height: scaleVertical(4),
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
        },
    };

    return shadows;
};
