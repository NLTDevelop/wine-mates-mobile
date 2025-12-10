import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';
import { getContrastColor } from '@/utils';

interface IProps {
    color: IWineColorShade;
    isActive: boolean;
    onPress: () => void;
}

export const ColorButton = ({ color, isActive, onPress }: IProps) => {
    const { colors } = useUiContext();
    const textColor = getContrastColor(color.colorHex);
    const styles = useMemo(() => getStyles(colors, textColor), [colors, textColor]);

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: color.colorHex }, isActive && styles.activeContainer]}
            onPress={onPress}
        >
            <Typography variant="body_400" text={color.name} numberOfLines={1} style={styles.text} />
        </TouchableOpacity>
    );
};
