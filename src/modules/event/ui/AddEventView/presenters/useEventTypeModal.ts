import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { EventType } from '@/entities/events/enums/EventType';
import { ISingleSelectModalItem } from '../types/ISingleSelectModalItem';

interface IProps {
    value: EventType;
    onChange: (value: EventType) => void;
}

export const useEventTypeModal = ({ value, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<EventType>(value);

    const onOpen = useCallback(() => {
        setDraft(value);
        setIsVisible(true);
    }, [value]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draft);
        });
    }, [draft, onChange]);

    const onSelectTastings = useCallback(() => {
        setDraft(EventType.Tastings);
    }, []);

    const onSelectParties = useCallback(() => {
        setDraft(EventType.Parties);
    }, []);

    const items = useMemo<ISingleSelectModalItem[]>(() => {
        return [
            {
                key: EventType.Tastings,
                label: localization.t('event.tastings'),
                isSelected: draft === EventType.Tastings,
                onPress: onSelectTastings,
            },
            {
                key: EventType.Parties,
                label: localization.t('event.parties'),
                isSelected: draft === EventType.Parties,
                onPress: onSelectParties,
            },
        ];
    }, [draft, onSelectParties, onSelectTastings]);

    return useMemo(() => {
        return {
            title: localization.t('event.eventType'),
            isVisible,
            selectedText: value === EventType.Parties
                ? localization.t('event.parties')
                : localization.t('event.tastings'),
            items,
            onOpen,
            onClose,
            onConfirm,
        };
    }, [isVisible, items, onClose, onConfirm, onOpen, value]);
};
