import { ContactType } from '@/entities/contacts/types/ContactType';

export interface IProfileLinkItem {
    id: string;
    url: string;
    title: string;
    contactType: ContactType;
}
