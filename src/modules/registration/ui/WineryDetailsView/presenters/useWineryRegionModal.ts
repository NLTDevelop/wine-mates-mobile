import { useCallback, useMemo, useState } from 'react';
import { localization } from '@/UIProvider/localization/Localization';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { IUniversalPickerOption } from '@/UIKit/UniversalPickerBottomModal/types/IUniversalPickerOption';

interface IProps {
    value: number | null;
    countryId?: number;
    regions: IDropdownItem[];
    onChange: (region: IDropdownItem) => void;
}

export const useWineryRegionModal = ({ value, countryId, regions, onChange }: IProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [draft, setDraft] = useState<number | null>(value);
    const isDisabled = !countryId || !regions.length;

    const onOpen = useCallback(() => {
        if (isDisabled) {
            return;
        }

        setDraft(value);
        setIsVisible(true);
    }, [isDisabled, value]);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const createOnSelect = useCallback((regionId: number) => {
        return () => {
            setDraft(regionId);
        };
    }, []);

    const options = useMemo<IUniversalPickerOption[]>(() => {
        return regions.map(region => {
            const regionId = Number(region.id);

            return {
                id: `${regionId}`,
                title: region.label,
                isSelected: draft === regionId,
                onPress: createOnSelect(regionId),
            };
        });
    }, [createOnSelect, draft, regions]);

    const selectedText = useMemo(() => {
        return regions.find(region => region.id === value)?.label || '';
    }, [regions, value]);

    const onConfirm = useCallback(() => {
        const selectedRegion = regions.find(region => region.id === draft);

        setIsVisible(false);

        if (!selectedRegion) {
            return;
        }

        requestAnimationFrame(() => {
            onChange(selectedRegion);
        });
    }, [draft, onChange, regions]);

    return {
        title: localization.t('registration.region'),
        isVisible,
        isDisabled,
        selectedText,
        options,
        onOpen,
        onClose,
        onConfirm,
    };
};
