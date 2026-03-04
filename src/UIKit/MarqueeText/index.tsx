import { memo, ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { MarqueeDividerIcon } from '@assets/icons/MarqueeDividerIcon';
import { useMarqueeText } from './presenters/useMarqueeText';

interface IProps {
    children: ReactNode;
    speed?: number;
    isEverlasting?: boolean;
    divider?: ReactNode;
    gap?: number;
}

const MarqueeTextComponent = ({ children, speed = 100, isEverlasting = true, divider, gap = 16 }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors, gap), [colors, gap]);
    const { animatedStyle, onContentLayout, onContainerLayout } = useMarqueeText({ speed, isEverlasting, gap });

    const defaultDivider = divider !== undefined ? divider : <MarqueeDividerIcon />;

    const content = (
        <View style={styles.contentItem} onLayout={onContentLayout}>
            {children}
            {defaultDivider && <View style={styles.divider}>{defaultDivider}</View>}
        </View>
    );

    return (
        <View style={styles.container} onLayout={onContainerLayout}>
            <Animated.View style={[styles.content, animatedStyle]}>
                {content}
                {content}
                {content}
            </Animated.View>
        </View>
    );
};

export const MarqueeText = memo(MarqueeTextComponent);
