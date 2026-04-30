import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { EditIcon } from '@assets/icons/EditIcon';
import { Checkbox } from '@/UIKit/Checkbox';
import { usePaymentsListItem } from './presenters/usePaymentsListItem';

interface IProps {
    item: IPaymentsListItem;
}

export const PaymentsListItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onEditPress, onToggleVisiblePress, isLoading } = usePaymentsListItem(item);

    return (
        <TouchableOpacity style={styles.container} onPress={onToggleVisiblePress}>
            <Typography text={item.name} variant="body_500"/>
            <View style={styles.row}>
                <TouchableOpacity onPress={onEditPress}>
                    <EditIcon width={20} height={20} color={colors.primary}/>
                </TouchableOpacity>
                <Checkbox isRound isChecked={item.isVisible} onPress={onToggleVisiblePress} disabled={isLoading} />
            </View>
        </TouchableOpacity>
    );
};
