import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { DragIcon } from '@assets/icons/DragIcon';
import { EditIcon } from '@assets/icons/EditIcon';
import { getStyles } from './styles';

interface IProps {
    title: string;
    onEditPress: () => void;
    onDragPress: () => void;
    isActive: boolean;
}

export const WineSetItemRow = ({ title, onEditPress, onDragPress, isActive }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const containerStyle = isActive ? styles.containerActive : styles.container;
    const contentStyle = isActive ? styles.contentActive : styles.content;
    const dragIconColor = isActive ? colors.primary : colors.text_light;

    return (
        <TouchableOpacity style={containerStyle} activeOpacity={1} onLongPress={onDragPress}>
            <TouchableOpacity style={styles.dragButton} onLongPress={onDragPress}>
                <DragIcon color={dragIconColor} />
            </TouchableOpacity>
            <View style={contentStyle}>
                <Typography variant="h6" text={title} numberOfLines={1} style={styles.title} />
                <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
                    <EditIcon color={colors.text} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};
