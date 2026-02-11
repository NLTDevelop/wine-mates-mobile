import { ReactElement, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { useCollapse } from './useCollapse';
import { getStyles } from './styles';

export interface ICollapseProps {
    title: string;
    children: ReactElement;
    defaultExpanded?: boolean;
    onToggle?: (isExpanded: boolean) => void;
}

export const Collapse = ({ title, children, defaultExpanded = false, onToggle }: ICollapseProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { isExpanded, animatedStyle, animatedArrowStyle, handlePress } = useCollapse({
        defaultExpanded,
        onToggle,
    });

    return (
        <View style={styles.card}>
            <TouchableOpacity style={styles.header} onPress={handlePress}>
                <Typography variant="h6" text={title} />
                <Animated.View style={animatedArrowStyle}>
                    <ArrowDownIcon rotate={0} />
                </Animated.View>
            </TouchableOpacity>

            {isExpanded && (
                <Animated.View style={animatedStyle}>
                    <View style={styles.content}>
                        {children}
                    </View>
                </Animated.View>
            )}
        </View>
    );
};
