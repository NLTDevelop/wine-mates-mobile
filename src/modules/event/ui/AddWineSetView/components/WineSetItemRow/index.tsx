import { memo, useMemo } from 'react';
import { View } from 'react-native';
import Sortable from 'react-native-sortables';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { DragIcon } from '@assets/icons/DragIcon';
import { EditIcon } from '@assets/icons/EditIcon';
import { getStyles } from './styles';

interface IProps {
    title: string;
    onEditPress: () => void;
}

const WineSetItemRowComponent = ({ title, onEditPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
            <View style={styles.container}>
            <View style={styles.dragButton}>
                <DragIcon color={colors.text_light} />
            </View>
            <View style={styles.content}>
                <Typography variant="h6" text={title} numberOfLines={1} style={styles.title} />
                <Sortable.Touchable onTap={onEditPress} style={styles.editButton}>
                    <EditIcon color={colors.text} />
                </Sortable.Touchable>
            </View>
        </View>
    );
};

export const WineSetItemRow = memo(WineSetItemRowComponent);
