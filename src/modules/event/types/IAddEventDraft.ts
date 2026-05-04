import { EventType } from '@/entities/events/enums/EventType';
import { ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { Sex } from '@/entities/events/enums/Sex';
import { TastingType } from '@/entities/events/enums/TastingType';

export interface IAddEventDraft {
    theme: string;
    description: string;
    restaurantName: string;
    locationLabel: string;
    locationCountry?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    eventStartDate: string;
    eventEndDate: string;
    eventStartTime: string;
    eventEndTime: string;
    phoneNumber: string;
    paymentMethodIds: number[];
    contactIds: number[];
    price: string;
    currency: string;
    speakerName: string;
    language: string;
    seats: string;
    minAge: number;
    maxAge: number;
    sex?: Sex;
    eventType: EventType;
    tastingType: TastingType;
    participationCondition?: ParticipationCondition;
    requiresConfirmation: boolean;
}
