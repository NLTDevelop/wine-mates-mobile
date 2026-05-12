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
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);

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

    const onOpenDeleteAlert = useCallback(() => {
        setIsDeleteAlertVisible(true);
    }, []);

    const onCloseDeleteAlert = useCallback(() => {
        setIsDeleteAlertVisible(false);
    }, []);

    const onDeletePress = useCallback(async () => {
        if (isLoading) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await contactsService.delete(item.id);

            if (response.isError) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }

            const listResponse = await contactsService.list();

            if (listResponse.isError) {
                contactsModel.list = (contactsModel.list || []).filter((contact) => contact.id !== item.id);
            }

            onCloseDeleteAlert();
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
            toastService.showError(localization.t('common.errorHappened'));
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, item.id, onCloseDeleteAlert]);

    return {
        onEditPress,
        onToggleVisiblePress,
        onOpenDeleteAlert,
        onCloseDeleteAlert,
        onDeletePress,
        isLoading,
        isDeleteAlertVisible,
        contactType,
        title,
        phoneCountryCode,
    };
};
