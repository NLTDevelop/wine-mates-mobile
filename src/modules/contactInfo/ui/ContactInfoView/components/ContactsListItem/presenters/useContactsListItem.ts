import { useCallback, useMemo, useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { IContactsListItem } from '@/entities/contacts/types/IContactsListItem';
import { contactsModel } from '@/entities/contacts/ContactsModel';
import { contactsService } from '@/entities/contacts/ContactsService';
import { getContactTitle, getContactType } from '@/entities/contacts/presenters/useContactType';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

interface IProps {
    item: IContactsListItem;
    onEditContact: (item: IContactsListItem) => void;
}


export const useContactsListItem = ({ item, onEditContact }: IProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const contactType = useMemo(() => {
        return getContactType(item.name, item.value);
    }, [item]);

    const title = useMemo(() => {
        return getContactTitle(item.name, item.value, contactType);
    }, [contactType, item]);

    const phoneCountryCode = useMemo(() => {
        if (contactType !== 'phone') {
            return '';
        }

        const phoneNumber = parsePhoneNumberFromString(item.value);
        return phoneNumber?.country || '';
    }, [contactType, item.value]);

    const onEditPress = useCallback(() => {
        onEditContact(item);
    }, [item, onEditContact]);

    const onToggleVisiblePress = useCallback(async () => {
        if (isLoading) {
            return;
        }

        const nextVisible = !item.isVisible;

        try {
            setIsLoading(true);
            const response = await contactsService.update(item.id, {
                isVisible: nextVisible,
            });

            if (response.isError) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }

            const currentList = contactsModel.list || [];
            const updatedContact = response.data;
            contactsModel.list = currentList.map(contact => {
                if (contact.id === item.id) {
                    return updatedContact || {
                        ...contact,
                        isVisible: nextVisible,
                    };
                }

                return contact;
            });
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
            toastService.showError(localization.t('common.errorHappened'));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, item.id, item.isVisible]);

    return {
        onEditPress,
        onToggleVisiblePress,
        isLoading,
        contactType,
        title,
        phoneCountryCode,
    };
};
