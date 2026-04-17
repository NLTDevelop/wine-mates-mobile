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
}

export const WineSetItemRow = ({ title, onEditPress }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <DragIcon color={colors.text_light} />
            <View style={styles.content}>
                <Typography variant="h6" text={title} numberOfLines={1} style={styles.title} />
                <TouchableOpacity onPress={onEditPress} style={styles.editButton}>
                    <EditIcon color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
