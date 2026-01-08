import { useEffect, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { IWineTaste } from '@/entities/wine/types/IWineTaste';
import { IWineSelectedSmell } from '@/entities/wine/types/IWineSelectedSmell';
import Animated, { useAnimatedStyle, useSharedValue, Easing, withTiming, withDelay } from 'react-native-reanimated';

interface IProps {
    item: IWineSelectedSmell | IWineTaste;
    onPress: () => void;
    isNew?: boolean;
}

export const SelectedItems = ({ item, onPress, isNew = false }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, item.colorHex || colors.background_grey), [colors, item]);
    const scale = useSharedValue(1);

    useEffect(() => {
        if (isNew) {
            scale.value = 0;
            scale.value = withDelay(
                10,
                withTiming(0.95, {
                    duration: 400,
                    easing: Easing.out(Easing.back(1)),
                })
            );
        }
    }, [isNew, scale, item]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <Typography text={item.name} variant="body_400" style={styles.text}/>
            </TouchableOpacity>
        </Animated.View>
    );
};
