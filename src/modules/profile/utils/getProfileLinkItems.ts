import { getContactTitle, getContactType } from '@/entities/contacts/presenters/useContactType';
import { IProfileLinkItem } from '@/modules/profile/types/IProfileLinkItem';

export const getProfileLinkItems = (links: string[]): IProfileLinkItem[] => {
    return links.map((url, index) => {
        const contactType = getContactType('', url);

        return {
            id: `${index}-${url}`,
            url,
            contactType,
            title: getContactTitle('', url, contactType) || url,
        };
    });
};
