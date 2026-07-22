import { useCallback, useMemo, useState } from 'react';
import { IEditableRegistrationLink } from '@/modules/registration/types/IEditableRegistrationLink';

export const useRegistrationLinks = (initialLinks?: string[]) => {
    const [links, setLinks] = useState<string[]>(() => (initialLinks?.length ? initialLinks : ['']));

    const onChangeLink = useCallback((index: number, value: string) => {
        setLinks(currentLinks => currentLinks.map((link, linkIndex) => (linkIndex === index ? value : link)));
    }, []);

    const onDeleteLink = useCallback((index: number) => {
        setLinks(currentLinks => {
            const nextLinks = currentLinks.filter((_link, linkIndex) => linkIndex !== index);

            return nextLinks.length ? nextLinks : [''];
        });
    }, []);

    const onAddLink = useCallback(() => {
        setLinks(currentLinks => [...currentLinks, '']);
    }, []);

    const editableLinks = useMemo<IEditableRegistrationLink[]>(() => {
        return links.map((value, index) => ({
            id: `registration-link-${index}`,
            value,
            onChangeText: nextValue => onChangeLink(index, nextValue),
            onDelete: () => onDeleteLink(index),
        }));
    }, [links, onChangeLink, onDeleteLink]);

    const normalizedLinks = useMemo(() => {
        return links.map(link => link.trim()).filter(Boolean);
    }, [links]);

    return {
        editableLinks,
        normalizedLinks,
        onAddLink,
    };
};
