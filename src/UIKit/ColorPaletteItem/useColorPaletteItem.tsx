import { useCallback, useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IUseColorPaletteItemProps {
    colorHex: string;
    onPress?: () => void;
}

export const useColorPaletteItem = ({ colorHex, onPress }: IUseColorPaletteItemProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, colorHex), [colors, colorHex]);

    const handlePress = useCallback(() => {
        if (onPress) {
            onPress();
        }
    }, [onPress]);

    return {
        styles,
        handlePress,
    };
};
