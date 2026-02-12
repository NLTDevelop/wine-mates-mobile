import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { useColorPaletteItem } from './useColorPaletteItem';

export interface IColorPaletteItemProps {
    text: string;
    colorHex: string;
    onPress?: () => void;
    isSelected?: boolean;
}

export const ColorPaletteItem = ({ text, colorHex, onPress, isSelected = false }: IColorPaletteItemProps) => {
    const { styles, handlePress } = useColorPaletteItem({ colorHex, onPress });

    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container style={styles.container} onPress={handlePress}>
            <Typography text={text} variant="body_500" style={styles.text} numberOfLines={1} />
            {isSelected && <View style={styles.selectedIndicator} />}
        </Container>
    );
};
