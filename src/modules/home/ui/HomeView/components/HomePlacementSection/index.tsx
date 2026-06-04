import { ReactNode, memo, useMemo } from 'react';
import { View } from 'react-native';
import Sortable from 'react-native-sortables';
import { useUiContext } from '@/UIProvider';
import { DragIcon } from '@assets/icons/DragIcon';
import { getStyles } from './styles';

interface IProps {
    children: ReactNode;
    onRemovePress?: () => void;
}

const HomePlacementSectionComponent = ({ children, onRemovePress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Sortable.Touchable onTap={onRemovePress} style={styles.removeButton}>
                <View style={styles.removeLine} />
            </Sortable.Touchable>
            <View style={styles.dragIcon}>
                <DragIcon width={18} height={18} color={colors.text_light} />
            </View>
            <View pointerEvents="none" style={styles.content}>
                {children}
            </View>
        </View>
    );
};

export const HomePlacementSection = memo(HomePlacementSectionComponent);
