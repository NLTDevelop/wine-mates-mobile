import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ISubscriptionPlanViewItem } from '../types/ISubscriptionPlanViewItem';
import { SUBSCRIPTIONS } from '@/entities/subscriptions/mock/Subscriptions';
import { PlanDurationEnum } from '@/entities/subscriptions/enums/PlanDurationEnum';
import { localization } from '@/UIProvider/localization/Localization';
import { subscriptionsModel } from '@/entities/subscriptions/SubscriptionsModel';

export const useSubscriptions = () => {
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<PlanDurationEnum>(PlanDurationEnum.Quarterly);
    const [isLoading, setIsLoading] = useState(true);
    const data = subscriptionsModel.list;

    const getList = useCallback(() => {
        setIsLoading(true);

        const timeoutId = setTimeout(() => {
            subscriptionsModel.list = SUBSCRIPTIONS;
            setIsLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            return getList();
        }, [getList]),
    );

    const onStartTrialPress = useCallback(() => {
        console.log('onStartTrialPress');
    }, []);

    const subscriptions = useMemo<ISubscriptionPlanViewItem[]>(() => {
        if (!data?.items.length) {
            return [];
        }

        return data?.items.map(item => {
            const onPress = () => {
                setSelectedSubscriptionId(item.id);
            };

            return {
                ...item,
                formattedPrice: `${item.currency}${item.price}`,
                discountLabel: item.discount
                    ? localization.t('subscriptions.saveDiscount', { discount: item.discount })
                    : '',
                isSelected: item.id === selectedSubscriptionId,
                onPress,
            };
        });
    }, [data?.items, selectedSubscriptionId]);

    const subscriptionFeatures = useMemo(() => {
        const selectedSubscription = data?.items.find(item => item.id === selectedSubscriptionId);

        return selectedSubscription?.descriptions || [];
    }, [data?.items, selectedSubscriptionId]);

    return {
        subscriptionFeatures,
        subscriptions,
        isLoading,
        isNeedShowTrialButton: !!data?.isTrialEnabled,
        onStartTrialPress,
    };
};
