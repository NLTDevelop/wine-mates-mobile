import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';
import { useColorButton } from './useColorButton';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    color: IWineColorShade;
    isActive: boolean;
    onPress: () => void;
}

export const ColorButton = ({ color, isActive, onPress }: IProps) => {
    const { colors } = useUiContext();
    const { isRedColor } = useColorButton({ color });
    const styles = useMemo(() => getStyles(colors, color.colorHex, isRedColor), [colors, color.colorHex, isRedColor]);

    return (
        <TouchableOpacity
            style={[styles.container, isActive && styles.activeContainer]}
            onPress={onPress}
        >
            <Typography variant="body_400" text={color.name} numberOfLines={2} style={styles.text} />
        </TouchableOpacity>
    );
};
