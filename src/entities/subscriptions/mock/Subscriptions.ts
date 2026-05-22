import { ISubscriptions } from '../types/ISubscription';
import { PlanDurationEnum } from '../enums/PlanDurationEnum';

export const SUBSCRIPTIONS: ISubscriptions = {
    isTrialEnabled: true,
    items: [
        {
            id: PlanDurationEnum.Monthly,
            title: '1',
            description: 'Month',
            duration: 1,
            durationLabel: '1 month',
            price: 2.99,
            currency: '$',
            priceDescription: 'per month',
            descriptions: [
                '10 AI-generated tasting notes',
                'Create up to 2 wine events on the map',
                'Add your own aromas and flavors',
                'Unlock all wine styles and personalized recommendations',
            ],
        },
        {
            id: PlanDurationEnum.Quarterly,
            title: '3',
            description: 'Months',
            duration: 3,
            durationLabel: '3 months',
            price: 3.99,
            currency: '$',
            priceDescription: 'per 3 month',
            discount: 10,
            isPopular: true,
            descriptions: [
                '100 AI-generated tasting notes',
                'Create up to 20 wine events on the map',
                'Add your own aromas and flavors',
                'Unlock all wine styles and personalized recommendations',
            ],
        },
        {
            id: PlanDurationEnum.Yearly,
            title: '12',
            description: 'Months',
            duration: 12,
            durationLabel: '12 months',
            price: 9.99,
            currency: '$',
            priceDescription: 'per 12 month',
            discount: 20,
            descriptions: [
                '1000 AI-generated tasting notes',
                'Create up to 200 wine events on the map',
                'Add your own aromas and flavors',
                'Unlock all wine styles and personalized recommendations',
            ],
        },
    ],
};
