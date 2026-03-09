import { useMemo, useCallback, useRef, useEffect } from 'react';
import { IVintage } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineModel } from '@/entities/wine/WineModel';
import { localization } from '@/UIProvider/localization/Localization';
import { IVintageDropdownItem } from '../ui/components/VintageDropdown/types/IVintageDropdownItem';

interface IProps {
    vintages: IVintage[];
    currentVintage: IVintage | null;
    onVintageChange: (item: IDropdownItem) => void;
    selectedVintage: number | null;
}

export const useVintageDropdown = ({ vintages, currentVintage, onVintageChange, selectedVintage }: IProps) => {
    const dropdownRef = useRef<any>(null);
    const isInitialAllApplied = useRef(false);

    const vintageData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 2010;
        const yearsSet = new Set<number>();

        const years: IVintageDropdownItem[] = [
            {
                label: localization.t('wine.allVintages'),
                value: null,
            },
        ];

        vintages.forEach(v => {
            if (v.vintage !== null) {
                yearsSet.add(v.vintage);
                years.push({
                    label: v.vintage.toString(),
                    value: v.vintage,
                    id: v.wineId,
                    averageUserRating: v.averageUserRating,
                    averageExpertRating: v.averageExpertRating,
                    totalReviews: v.totalReviews,
                    countExpertRating: v.countExpertRating,
                });
            }
        });

        if (currentVintage && currentVintage.vintage !== null && !yearsSet.has(currentVintage.vintage)) {
            yearsSet.add(currentVintage.vintage);
            years.push({
                label: currentVintage.vintage.toString(),
                value: currentVintage.vintage,
                id: currentVintage.wineId,
                averageUserRating: currentVintage.averageUserRating,
                averageExpertRating: currentVintage.averageExpertRating,
                totalReviews: currentVintage.totalReviews,
                countExpertRating: currentVintage.countExpertRating,
            });
        }

        if (wineModel.customVintage !== null && !yearsSet.has(wineModel.customVintage)) {
            yearsSet.add(wineModel.customVintage);
            years.push({
                label: wineModel.customVintage.toString(),
                value: wineModel.customVintage,
            });
        }

        for (let year = currentYear; year >= startYear; year--) {
            if (!yearsSet.has(year)) {
                yearsSet.add(year);
                years.push({
                    label: year.toString(),
                    value: year,
                });
            }
        }

        years.sort((a, b) => {
            if (a.value === null) return -1;
            if (b.value === null) return 1;
            return (b.value as number) - (a.value as number);
        });

        return years;
    }, [vintages, currentVintage, localization.t]);

    useEffect(() => {
        if (isInitialAllApplied.current) {
            return;
        }

        if (!vintageData.length) {
            return;
        }

        if (selectedVintage !== null) {
            const allItem = vintageData.find(item => item.value === null);
            if (allItem) {
                onVintageChange(allItem);
            }
        }

        isInitialAllApplied.current = true;
    }, [selectedVintage, vintageData, onVintageChange]);

    const onCustomVintageAdd = useCallback(
        (year: number) => {
            const vintageInList = vintages.find(v => v.vintage === year);

            onVintageChange({
                label: year.toString(),
                value: year.toString(),
                id: vintageInList?.wineId?.toString(),
            });
        },
        [onVintageChange, vintages],
    );

    const onCloseDropdown = useCallback(() => {
        dropdownRef.current?.close?.();
    }, []);

    const existingYears = useMemo(() => {
        return vintageData.map(item => item.value as number);
    }, [vintageData]);

    const handleAddVintage = useCallback(
        (year: number, closeDropdown: () => void) => {
            wineModel.customVintage = year;
            onCustomVintageAdd(year);
            closeDropdown();
        },
        [onCustomVintageAdd],
    );

    return { vintageData, existingYears, handleAddVintage, dropdownRef, onCloseDropdown };
};
