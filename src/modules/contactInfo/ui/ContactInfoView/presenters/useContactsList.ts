import { useCallback, useEffect, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { contactsModel } from '@/entities/contacts/ContactsModel';
import { contactsService } from '@/entities/contacts/ContactsService';
import { IContactsListItem } from '@/entities/contacts/types/IContactsListItem';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

const getContactName = (value: string) => {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue.includes('instagram.com') || normalizedValue.includes('@instagram')) {
        return 'Instagram';
    }

    if (normalizedValue.includes('t.me') || normalizedValue.includes('telegram') || normalizedValue.includes('@')) {
        return 'Telegram';
    }

    if (normalizedValue.includes('facebook.com') || normalizedValue.includes('fb.com')) {
        return 'Facebook';
    }

    return value.trim();
};

export const useContactsList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [contactValue, setContactValue] = useState('');
    const [editingContact, setEditingContact] = useState<IContactsListItem | null>(null);
    const data = contactsModel.list || [];

    const getList = useCallback(async (withLoading: boolean = false) => {
        try {
            if (withLoading) {
                setIsLoading(true);
            }

            const response = await contactsService.list();

            if (response.isError || !response.data) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
            toastService.showError(localization.t('common.errorHappened'));
        } finally {
            if (withLoading) {
                setIsLoading(false);
            }
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getList(true);
        }, [getList]),
    );

    useEffect(() => {
        return () => contactsModel.clear();
    }, []);

    const onCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setContactValue('');
        setEditingContact(null);
    }, []);

    const onAddPress = useCallback(() => {
        setEditingContact(null);
        setContactValue('');
        setIsModalVisible(true);
    }, []);

    const onEditContact = useCallback((item: IContactsListItem) => {
        setEditingContact(item);
        setContactValue(item.value);
        setIsModalVisible(true);
    }, []);

    const onSaveContact = useCallback(async () => {
        const trimmedValue = contactValue.trim();

        if (!trimmedValue || isSaving) {
            return;
        }

        try {
            setIsSaving(true);
            Keyboard.dismiss();

            if (editingContact) {
                const response = await contactsService.update(editingContact.id, {
                    name: getContactName(trimmedValue),
                    value: trimmedValue,
                });

                if (response.isError || !response.data) {
                    toastService.showError(localization.t('common.errorHappened'), response.message);
                    return;
                }

                const currentList = contactsModel.list || [];
                const updatedContact = response.data;
                contactsModel.list = currentList.map(item => {
                    if (item.id === editingContact.id) {
                        return updatedContact;
                    }

                    return item;
                });
                onCloseModal();
                return;
            }

            const response = await contactsService.create({
                name: getContactName(trimmedValue),
                value: trimmedValue,
                isVisible: true,
            });

            if (response.isError || !response.data) {
                toastService.showError(localization.t('common.errorHappened'), response.message);
                return;
            }

            contactsModel.list = [...(contactsModel.list || []), response.data];
            onCloseModal();
        } catch (error) {
            console.error(JSON.stringify(error, null, 4));
            toastService.showError(localization.t('common.errorHappened'));
        } finally {
            setIsSaving(false);
        }
    }, [contactValue, editingContact, isSaving, onCloseModal]);

    const modalTitle = useMemo(() => {
        if (editingContact) {
            return localization.t('contactInfo.editContact');
        }

        return localization.t('contactInfo.addContact');
    }, [editingContact]);

    const isSaveDisabled = useMemo(() => {
        return !contactValue.trim() || isSaving;
    }, [contactValue, isSaving]);

    return {
        data,
        isLoading,
        getList,
        onAddPress,
        onEditContact,
        isModalVisible,
        contactValue,
        setContactValue,
        onCloseModal,
        onSaveContact,
        isSaving,
        modalTitle,
        isSaveDisabled,
    };
};
