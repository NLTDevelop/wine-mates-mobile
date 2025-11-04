import { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';

interface IProps {
    color: {
        color: string;
        colorName: string;
    };
    isActive: boolean;
    onPress: () => void;
}

export const ColorButton = ({ color, isActive, onPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: color.color }, isActive && styles.activeContainer]}
            onPress={onPress}
        >
            <Typography variant="body_400" text={color.colorName} numberOfLines={1} style={styles.text} />
        </TouchableOpacity>
    );
};
