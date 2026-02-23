import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { useEffect, useState } from 'react';
import { Animated, Platform } from 'react-native';

interface IProps {
    item: IWineListItem;
    index: number;
    onPress: (item: IWineListItem) => void;
}


export const AnimatedWineListItem = ({ item, index, onPress }: IProps) => {
    const [fadeAnim] = useState(() => new Animated.Value(0));
    const [translateYAnim] = useState(() => new Animated.Value(20));

    useEffect(() => {
        if (Platform.OS === 'ios') {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    delay: index * 50,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 400,
                    delay: index * 50,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(1);
            translateYAnim.setValue(0);
        }
    }, [fadeAnim, translateYAnim, index]);

    if (Platform.OS !== 'ios') {
        return <WineListItem item={item} onPress={onPress} hideSimilarity showDate />;
    }

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
            }}
        >
            <WineListItem item={item} onPress={onPress} hideSimilarity showDate />
        </Animated.View>
    );
};
