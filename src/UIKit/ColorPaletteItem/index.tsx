import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useColorPaletteItem } from './useColorPaletteItem';
import { useUiContext } from '@/UIProvider';
import { useMemo } from 'react';
import { getStyles } from '@/UIKit/ColorPaletteItem/styles.ts';

export interface IColorPaletteItemProps {
    text: string;
    colorHex: string;
    onPress?: () => void;
    isSelected?: boolean;
    isFullWidthText?: boolean;
}

export const ColorPaletteItem = ({ text, colorHex, onPress, isSelected = false, isFullWidthText = false }: IColorPaletteItemProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, colorHex, isFullWidthText), [colors, colorHex, isFullWidthText]);
    const { handlePress } = useColorPaletteItem({ colorHex, onPress });

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container style={styles.container} onPress={handlePress}>
            <Typography text={text} variant="body_500" style={styles.text} numberOfLines={1} />
            {isSelected && <View style={styles.selectedIndicator} />}
        </Container>
    );
};
