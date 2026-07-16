import { ContactType } from '@/entities/contacts/types/ContactType';

export interface IWineryLinkItem {
    id: string;
    url: string;
    title: string;
    contactType: ContactType;
}
