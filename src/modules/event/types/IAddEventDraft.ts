import { Currency } from '@/entities/events/enums/Currency';
import { EventType } from '@/entities/events/enums/EventType';
import { ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { Sex } from '@/entities/events/enums/Sex';
import { TastingType } from '@/entities/events/enums/TastingType';

export interface IAddEventDraft {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    location: {
        latitude: number;
        longitude: number;
    };
    eventDate: string;
    eventTime: string;
    phoneNumber: string;
    price: string;
    currency: Currency;
    speakerName: string;
    language: string;
    seats: string;
    age: string;
    sex: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition: ParticipationCondition;
    requiresConfirmation: boolean;
}
