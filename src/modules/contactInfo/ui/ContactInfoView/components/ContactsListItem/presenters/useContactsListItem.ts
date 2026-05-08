import { useCallback, useMemo, useState } from 'react';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { IContactsListItem } from '@/entities/contacts/types/IContactsListItem';
import { contactsModel } from '@/entities/contacts/ContactsModel';
import { contactsService } from '@/entities/contacts/ContactsService';
import { toastService } from '@/libs/toast/toastService';
import { localization } from '@/UIProvider/localization/Localization';

interface IProps {
    item: IContactsListItem;
    onEditContact: (item: IContactsListItem) => void;
}

const getContactType = (item: IContactsListItem) => {
    const normalizedValue = item.value.toLowerCase();
    const normalizedName = item.name.toLowerCase();
    const normalizedContact = `${normalizedName} ${normalizedValue}`;

    if (normalizedContact.includes('instagram')) {
        return 'instagram';
    }

    if (normalizedContact.includes('telegram') || normalizedContact.includes('t.me')) {
        return 'telegram';
    }

    if (normalizedContact.includes('facebook') || normalizedContact.includes('fb.com')) {
        return 'facebook';
    }

    return 'phone';
};

const getUrlPath = (value: string) => {
    const withoutProtocol = value
        .trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '');
    const pathStartIndex = withoutProtocol.indexOf('/');

    if (pathStartIndex < 0) {
        return '';
    }

    return withoutProtocol.slice(pathStartIndex + 1);
};

const getQueryParam = (value: string, paramName: string) => {
    const queryStartIndex = value.indexOf('?');

    if (queryStartIndex < 0) {
        return '';
    }

    const query = value.slice(queryStartIndex + 1);
    const params = query.split('&');
    const foundParam = params.find(param => param.startsWith(`${paramName}=`));

    if (!foundParam) {
        return '';
    }

    return decodeURIComponent(foundParam.replace(`${paramName}=`, ''));
};

const getSocialTitle = (item: IContactsListItem) => {
    const trimmedValue = item.value.trim();

    if (trimmedValue.startsWith('@')) {
        return trimmedValue.slice(1);
    }

    if (!trimmedValue.includes('/') && !trimmedValue.includes('.')) {
        return trimmedValue;
    }

    const urlPath = getUrlPath(trimmedValue);

    if (urlPath) {
        const pathWithoutQuery = urlPath.split('?')[0];
        const pathParts = pathWithoutQuery.split('/').filter(Boolean);
        const [firstPathPart, secondPathPart] = pathParts;

        if (firstPathPart === 'profile.php') {
            return getQueryParam(trimmedValue, 'id') || item.name;
        }

        if (firstPathPart) {
            if (firstPathPart === 's' && secondPathPart) {
                return secondPathPart;
            }

            return firstPathPart;
        }
    }

    return item.name;
};

export const useContactsListItem = ({ item, onEditContact }: IProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const contactType = useMemo(() => {
        return getContactType(item);
    }, [item]);

    const title = useMemo(() => {
        if (contactType === 'phone') {
            return item.value;
        }

        return getSocialTitle(item);
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
