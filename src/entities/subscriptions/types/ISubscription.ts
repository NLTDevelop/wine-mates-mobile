import { PlanDurationEnum } from '../enums/PlanDurationEnum';

export interface ISubscription {
    id: PlanDurationEnum;
    title: string;
    description: string;
    duration: number;
    durationLabel: string;
    price: number;
    currency: string;
    priceDescription: string;
    discount?: number;
    isPopular?: boolean;
    descriptions: string[];
}

export interface ISubscriptions {
    items: ISubscription[];
    isTrialEnabled: boolean;
}
