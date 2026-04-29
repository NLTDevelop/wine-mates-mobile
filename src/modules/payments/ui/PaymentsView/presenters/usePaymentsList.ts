import { paymentsModel } from '@/entities/payments/PaymentsModel';
import { paymentsService } from '@/entities/payments/PaymentsService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

export const usePaymentsList = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isLoading, setIsLoading] = useState(true);
    const data = paymentsModel.list || [];

    const getList = useCallback(async (withLoading: boolean = false) => {
        try {
            if (withLoading) {
                setIsLoading(true);
            }

            const response = await paymentsService.list();

            if (response.isError || !response.data) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
        } finally {
            if (withLoading) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        getList(true);
    }, [getList]);

    useEffect(() => {
        return () => paymentsModel.clear();
    }, []);

    const onAddPress = useCallback(() => {
        navigation.navigate('CreatePaymentView');
    }, [navigation]);

    return { data, isLoading, getList, onAddPress };
};
