import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { TastingType, TASTING_TYPES } from '@/entities/events/enums/TastingType';

interface ITastingTypeModalItem {
    value: TastingType;
    label: string;
    onPress: () => void;
}

interface IProps {
    value: TastingType;
    onChange: (value: TastingType) => void;
}

const TASTING_TYPE_LABEL_KEYS: Record<TastingType, string> = {
    [TastingType.Blind]: 'event.tastingTypeBlind',
    [TastingType.Regular]: 'event.tastingTypeRegular',
};

export const useTastingTypeModal = ({ value, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<TastingType>(value);

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

    const createOnSelect = useCallback((nextValue: TastingType) => {
        return () => {
            setDraft(nextValue);
        };
    }, []);

    const items = useMemo<ITastingTypeModalItem[]>(() => {
        return TASTING_TYPES.map((currentValue) => {
            const tastingValue = currentValue as TastingType;

            return {
                value: tastingValue,
                label: localization.t(TASTING_TYPE_LABEL_KEYS[tastingValue]),
                onPress: createOnSelect(tastingValue),
            };
        });
    }, [createOnSelect]);

    const selectedText = useMemo(() => {
        return localization.t(TASTING_TYPE_LABEL_KEYS[value]);
    }, [value]);

    return {
        isVisible,
        draft,
        selectedText,
        items,
        onOpen,
        onClose,
        onConfirm,
    };
};
