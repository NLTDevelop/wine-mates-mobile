import { useCallback, useMemo, useState } from 'react';
import { EventType } from '@/entities/events/enums/EventType';

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

    const onSelect = useCallback((nextValue: EventType) => {
        setDraft(nextValue);
    }, []);

    const onConfirm = useCallback(() => {
        setIsVisible(false);

        requestAnimationFrame(() => {
            onChange(draft);
        });
    }, [draft, onChange]);

    return useMemo(() => {
        return {
            isVisible,
            draft,
            onOpen,
            onClose,
            onSelect,
            onConfirm,
        };
    }, [draft, isVisible, onClose, onConfirm, onOpen, onSelect]);
};
