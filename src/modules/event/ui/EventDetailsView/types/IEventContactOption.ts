import { ContactType } from '@/entities/contacts/types/ContactType';

export type EventContactType = ContactType;

export interface IEventContactOption {
    id: number;
    type: EventContactType;
    title: string;
    phoneCountryCode: string;
    onPress: () => void;
}
