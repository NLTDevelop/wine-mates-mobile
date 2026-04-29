import { IPaymentsListItem } from '@/entities/payments/types/IPaymentsListItem';
import { paymentsService } from '@/entities/payments/PaymentsService';
import { paymentsModel } from '@/entities/payments/PaymentsModel';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';

export const usePaymentsListItem = (item: IPaymentsListItem) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(false);

    const onEditPress = useCallback(() => {
        navigation.navigate('CreatePaymentView', { payment: item });
    }, [item, navigation]);

    const onToggleVisiblePress = useCallback(async () => {
        if (isLoading) {
            return;
        }

        const nextVisible = !item.isVisible;

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('isVisible', String(nextVisible));

            const response = await paymentsService.update(item.id, formData);

            if (response.isError) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }

            const currentList = paymentsModel.list || [];
            paymentsModel.list = currentList.map(payment =>
                payment.id === item.id
                    ? {
                        ...payment,
                        isVisible: nextVisible,
                    }
                    : payment,
            );
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
            toastService.showError(localization.t('common.errorHappened'));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, item.id, item.isVisible]);

    return { onEditPress, onToggleVisiblePress, isLoading };
};
