import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { ReactNode } from 'react';
import { Animated } from 'react-native';
import { isIOS } from '@/utils';
import { useAnimatedWineListItem } from './useAnimatedWineListItem';

interface IProps {
    item: IWineListItem;
    index: number;
    onPress: (item: IWineListItem) => void;
    footer?: ReactNode;
}

export const AnimatedWineListItem = ({ item, index, onPress, footer }: IProps) => {
    const { fadeAnim, translateYAnim } = useAnimatedWineListItem({ index });

    if (isIOS) {
        return <WineListItem item={item} onPress={onPress} hideSimilarity showDate footer={footer} />;
    }

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
            }}
        >
            <WineListItem item={item} onPress={onPress} hideSimilarity showDate footer={footer} />
        </Animated.View>
    );
};
