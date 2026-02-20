import { useCallback } from 'react';

interface IUseColorPaletteItemProps {
    colorHex: string;
    onPress?: () => void;
}

export const useColorPaletteItem = ({ onPress }: IUseColorPaletteItemProps) => {

    const handlePress = useCallback(() => {
        if (onPress) {
            onPress();
        }
    }, [onPress]);

    return {
        handlePress,
    };
};
