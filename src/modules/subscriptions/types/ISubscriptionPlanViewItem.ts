import { ISubscription } from '@/entities/subscriptions/types/ISubscription';

export interface ISubscriptionPlanViewItem extends ISubscription {
    formattedPrice: string;
    discountLabel?: string;
    isSelected: boolean;
    onPress: () => void;
}
