import { memo, useMemo } from 'react';
import { View } from 'react-native';
import Sortable from 'react-native-sortables';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { DragIcon } from '@assets/icons/DragIcon';
import { EditIcon } from '@assets/icons/EditIcon';
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
import { getStyles } from './styles';

interface IProps {
    title: string;
    subtitle: string;
    onEditPress: () => void;
    onDeletePress: () => void;
}

const WineSetItemRowComponent = ({ title, subtitle, onEditPress, onDeletePress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <View style={styles.dragButton}>
                <DragIcon color={colors.text_light} />
            </View>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Typography variant="body_400" text={title} style={styles.title} />
                {!!subtitle && <Typography variant="body_400" text={subtitle} style={styles.subtitle} />}
                </View>
                <View style={styles.actions}>
                    <Sortable.Touchable onTap={onEditPress} style={styles.actionButton}>
                        <EditIcon color={colors.text} />
                    </Sortable.Touchable>
                    <Sortable.Touchable onTap={onDeletePress} style={styles.actionButton}>
                        <DeleteForeverIcon width={20} height={20} color={colors.primary} />
                    </Sortable.Touchable>
                </View>


            </View>
            
        </View>
    );
};

export const WineSetItemRow = memo(WineSetItemRowComponent);
