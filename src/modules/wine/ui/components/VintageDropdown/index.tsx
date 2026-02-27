import { useRef, useEffect } from 'react';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { IVintage } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { useVintageDropdown } from './useVintageDropdown';
import { CustomVintageFooter } from '../CustomVintageFooter';

interface IProps {
    vintages: IVintage[];
    currentVintage: IVintage | null;
    selectedVintage: number | null;
    onVintageChange: (item: IDropdownItem) => void;
    onClearCustomVintages?: (clearFn: () => void) => void;
}

export const VintageDropdown = ({ vintages, currentVintage, selectedVintage, onVintageChange, onClearCustomVintages }: IProps) => {
    const dropdownRef = useRef<any>(null);

    const handleCustomVintageAdd = (year: number) => {
        onVintageChange({
            label: year.toString(),
            value: year,
        });
    };

    const closeDropdown = () => {
        dropdownRef.current?.close?.();
    };

    const {
        vintageData,
        selectedVintageValue,
        renderVintageValue,
        renderVintageItem,
        existingYears,
        handleAddVintage,
        clearCustomVintages,
        styles,
    } = useVintageDropdown({
        vintages,
        currentVintage,
        selectedVintage,
        onVintageChange: handleCustomVintageAdd,
    });

    useEffect(() => {
        if (onClearCustomVintages) {
            onClearCustomVintages(clearCustomVintages);
        }
    }, [onClearCustomVintages, clearCustomVintages]);

    return (
        <CustomDropdown
            ref={dropdownRef}
            data={vintageData}
            placeholder=""
            onPress={onVintageChange}
            selectedValue={selectedVintage}
            containerStyle={styles.dropdown}
            disabled={vintageData.length === 0}
            renderItem={renderVintageItem}
            renderSelectedValue={renderVintageValue}
            renderFooter={() => (
                <CustomVintageFooter
                    existingYears={existingYears}
                    onAddVintage={(year) => handleAddVintage(year, closeDropdown)}
                />
            )}
        />
    );
};
