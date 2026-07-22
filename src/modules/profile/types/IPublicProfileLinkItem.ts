import { ContactType } from '@/entities/contacts/types/ContactType';

export interface IPublicProfileLinkItem {
    id: string;
    title: string;
    contactType: ContactType;
    onPress: () => void;
}
