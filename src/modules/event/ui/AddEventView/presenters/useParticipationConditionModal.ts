import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { PARTICIPATION_CONDITIONS, ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { ISingleSelectModalItem } from '../types/ISingleSelectModalItem';

interface IProps {
    value?: ParticipationCondition;
    onChange: (value?: ParticipationCondition) => void;
}

const getParticipationConditionLabel = (value: ParticipationCondition) => {
    if (value === ParticipationCondition.FixedPrice) {
        return localization.t('event.participationConditionFixedPrice');
    }

    if (value === ParticipationCondition.SplitBill) {
        return localization.t('event.participationConditionSplitBill');
    }

    if (value === ParticipationCondition.Free) {
        return localization.t('event.participationConditionFree');
    }

    if (value === ParticipationCondition.Charity) {
        return localization.t('event.participationConditionCharity');
    }

    if (value === ParticipationCondition.Host) {
        return localization.t('event.participationConditionHost');
    }

    return localization.t('event.participationConditionGuest');
};

export const useParticipationConditionModal = ({ value, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<ParticipationCondition | undefined>(value);

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

    const createOnSelect = useCallback((nextValue: ParticipationCondition) => {
        return () => {
            setDraft(nextValue);
        };
    }, []);

    const items = useMemo<ISingleSelectModalItem[]>(() => {
        return PARTICIPATION_CONDITIONS.map((itemValue) => {
            return {
                key: itemValue,
                label: getParticipationConditionLabel(itemValue),
                isSelected: draft === itemValue,
                onPress: createOnSelect(itemValue),
            };
        });
    }, [createOnSelect, draft]);

    const selectedText = useMemo(() => {
        if (!value) {
            return localization.t('event.participationCondition');
        }

        return getParticipationConditionLabel(value);
    }, [value]);

    return useMemo(() => {
        return {
            title: localization.t('event.participationCondition'),
            isVisible,
            items,
            selectedText,
            onOpen,
            onClose,
            onConfirm,
        };
    }, [isVisible, items, onClose, onConfirm, onOpen, selectedText]);
};
