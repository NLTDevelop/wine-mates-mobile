import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { TastingType, TASTING_TYPES } from '@/entities/events/enums/TastingType';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';

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

    const items = useMemo<IUniversalPickerOption[]>(() => {
        return TASTING_TYPES.map((currentValue) => {
            const tastingValue = currentValue as TastingType;

            return {
                id: tastingValue,
                title: localization.t(TASTING_TYPE_LABEL_KEYS[tastingValue]),
                isSelected: draft === tastingValue,
                onPress: createOnSelect(tastingValue),
            };
        });
    }, [createOnSelect, draft]);

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
