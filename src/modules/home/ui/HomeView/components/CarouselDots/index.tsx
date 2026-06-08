import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    count: number;
    activeIndex: number;
}

export const CarouselDots = ({ count, activeIndex }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    if (count <= 1) {
        return null;
    }

    return (
        <View style={styles.container}>
            {Array.from({ length: count }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index === activeIndex ? styles.activeDot : styles.inactiveDot,
                    ]}
                />
            ))}
        </View>
    );
};
