import { useMemo } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle, Animated } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { IWineColorShade } from '@/entities/wine/types/IWineColorShade';
import { useColorButton } from './useColorButton';
import { useColorButtonAnimation } from './useColorButtonAnimation';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    color: IWineColorShade;
    isActive: boolean;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
}

export const ColorButton = ({ color, isActive, onPress, containerStyle }: IProps) => {
    const { colors } = useUiContext();
    const { isRedColor } = useColorButton({ color });
    const styles = useMemo(() => getStyles(colors, color.colorHex, isRedColor), [colors, color.colorHex, isRedColor]);
    
    const { scaleAnim, borderOpacityAnim, handlePressIn, handlePressOut } = useColorButtonAnimation({ isActive });

    return (
        <TouchableOpacity
            style={[styles.container, isActive && styles.activeContainer, containerStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
        >
            <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, styles.container]}>
                <Typography variant="body_400" text={color.name} numberOfLines={2} style={styles.text} />
                {isActive && (
                    <Animated.View
                        style={[styles.activeBorder, { opacity: borderOpacityAnim }]}
                    />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};
