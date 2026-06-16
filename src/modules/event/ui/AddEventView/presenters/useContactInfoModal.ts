import { useCallback, useMemo, useState } from 'react';
import { IContactsListItem } from '@/entities/contacts/types/IContactsListItem';
import { getContactTitle, getContactType } from '@/entities/contacts/presenters/useContactType';
import { IContactInfoOption } from '@/modules/event/types/IContactInfoOption';

interface IProps {
    value: number[];
    contacts: IContactsListItem[];
    onChange: (value: number[]) => void;
    onOpenContactsPress: () => void;
}

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

const getContactLabel = (item: IContactsListItem) => {
    const contactType = getContactType(item.name, item.value);

    if (contactType === 'website') {
        return getContactTitle(item.name, item.value, contactType);
    }

    const trimmedValue = item.value.trim();

    if (trimmedValue.startsWith('@')) {
        return trimmedValue.slice(1);
    }

    if (!trimmedValue.includes('/') && !trimmedValue.includes('.')) {
        return trimmedValue;
    }

    const urlPath = getUrlPath(trimmedValue);

    if (!urlPath) {
        return item.name;
    }

    const pathWithoutQuery = urlPath.split('?')[0];
    const pathParts = pathWithoutQuery.split('/').filter(Boolean);
    const [firstPathPart, secondPathPart] = pathParts;

    if (firstPathPart === 's' && secondPathPart) {
        return secondPathPart;
    }

    return firstPathPart || item.name;
};

export const useContactInfoModal = ({ value, contacts, onChange, onOpenContactsPress }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draftIds, setDraftIds] = useState<number[]>(value);

    const onOpen = useCallback(() => {
        setDraftIds(value);
        setIsVisible(true);
    }, [value]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const createOnToggle = useCallback((id: number) => {
        return () => {
            setDraftIds(prev => {
                if (prev.includes(id)) {
                    return prev.filter(item => item !== id);
                }

                return [...prev, id];
            });
        };
    }, []);

    const options = useMemo<IContactInfoOption[]>(() => {
        return contacts.map((item) => {
            return {
                id: item.id,
                name: getContactLabel(item),
                isSelected: draftIds.includes(item.id),
                onPress: createOnToggle(item.id),
            };
        });
    }, [contacts, createOnToggle, draftIds]);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draftIds);
        });
    }, [draftIds, onChange]);

    const onOpenContacts = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onOpenContactsPress();
        });
    }, [onOpenContactsPress]);

    const selectedText = useMemo(() => {
        const selectedContacts = contacts.filter(item => value.includes(item.id));
        const [firstContact, secondContact] = selectedContacts;

        if (!firstContact) {
            return '';
        }

        if (!secondContact) {
            return getContactLabel(firstContact);
        }

        if (selectedContacts.length === 2) {
            return `${getContactLabel(firstContact)}, ${getContactLabel(secondContact)}`;
        }

        return `${getContactLabel(firstContact)}, ${getContactLabel(secondContact)} +${selectedContacts.length - 2}`;
    }, [contacts, value]);

    return useMemo(() => {
        return {
            isVisible,
            options,
            selectedText,
            onOpen,
            onClose,
            onConfirm,
            onOpenContacts,
        };
    }, [isVisible, onClose, onConfirm, onOpen, onOpenContacts, options, selectedText]);
};
