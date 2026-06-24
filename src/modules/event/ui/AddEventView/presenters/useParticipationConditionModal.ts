import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { PARTICIPATION_CONDITIONS, ParticipationCondition } from '@/entities/events/enums/ParticipationCondition';
import { PriceInputParticipationCondition } from '@/entities/events/types/PriceInputParticipationCondition';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';

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

const PRICE_INPUT_PARTICIPATION_CONDITIONS = [
    ParticipationCondition.FixedPrice,
    ParticipationCondition.SplitBill,
    ParticipationCondition.Charity,
] as const;

const PRICE_INPUT_HELPER_TEXT_KEYS: Record<PriceInputParticipationCondition, string> = {
    [ParticipationCondition.FixedPrice]: 'event.priceInputHelperTextFixedPrice',
    [ParticipationCondition.SplitBill]: 'event.priceInputHelperTextSplitBill',
    [ParticipationCondition.Charity]: 'event.priceInputHelperTextCharity',
};

const getPriceInputParticipationCondition = (value?: ParticipationCondition): PriceInputParticipationCondition | undefined => {
    if (!value || !PRICE_INPUT_PARTICIPATION_CONDITIONS.includes(value as PriceInputParticipationCondition)) {
        return undefined;
    }

    return value as PriceInputParticipationCondition;
};

const getPriceInputHelperText = (value: PriceInputParticipationCondition): string => {
    return localization.t(PRICE_INPUT_HELPER_TEXT_KEYS[value]);
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

    const items = useMemo<IUniversalPickerOption[]>(() => {
        return PARTICIPATION_CONDITIONS.map(itemValue => {
            return {
                id: itemValue,
                title: getParticipationConditionLabel(itemValue),
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

    const priceInputHelperText = useMemo(() => {
        const priceInputParticipationCondition = getPriceInputParticipationCondition(value);

        if (priceInputParticipationCondition) {
            return getPriceInputHelperText(priceInputParticipationCondition);
        }

        return '';
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
            priceInputHelperText,
        };
    }, [isVisible, items, onClose, onConfirm, onOpen, selectedText, priceInputHelperText]);
};
