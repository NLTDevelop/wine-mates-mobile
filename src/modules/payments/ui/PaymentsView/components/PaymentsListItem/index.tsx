import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { EditIcon } from '@assets/icons/EditIcon';
import { Checkbox } from '@/UIKit/Checkbox';
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
import { usePaymentsListItem } from './presenters/usePaymentsListItem';
import { DeletePaymentMethodAlert } from '../DeletePaymentMethodAlert';

interface IProps {
    item: IPaymentsListItem;
}

export const PaymentsListItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        onEditPress,
        onToggleVisiblePress,
        onOpenDeleteAlert,
        onCloseDeleteAlert,
        onDeletePress,
        isLoading,
        isDeleteAlertVisible,
    } = usePaymentsListItem(item);

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={onToggleVisiblePress}>
                <Typography text={item.name} variant="body_500"/>
                <View style={styles.row}>
                    <TouchableOpacity onPress={onEditPress} style={styles.actionButton} hitSlop={10}>
                        <EditIcon width={24} height={24} color={colors.primary}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onOpenDeleteAlert} style={styles.actionButton} hitSlop={10}>
                        <DeleteForeverIcon width={24} height={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Checkbox isRound isChecked={item.isVisible} onPress={onToggleVisiblePress} disabled={isLoading} />
                </View>
            </TouchableOpacity>
            <DeletePaymentMethodAlert
                visible={isDeleteAlertVisible}
                onClose={onCloseDeleteAlert}
                onConfirm={onDeletePress}
                isLoading={isLoading}
            />
        </>
    );
};
