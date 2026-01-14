import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';

interface IProps {
    color: IWineColorShade;
    isActive: boolean;
    onPress: () => void;
}

export const ColorButton = ({ color, isActive, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, color.colorHex), [colors, color]);

    return (
        <TouchableOpacity
            style={[styles.container, isActive && styles.activeContainer]}
            onPress={onPress}
        >
            <Typography variant="body_400" text={color.name} numberOfLines={2} style={styles.text} />
        </TouchableOpacity>
    );
};
