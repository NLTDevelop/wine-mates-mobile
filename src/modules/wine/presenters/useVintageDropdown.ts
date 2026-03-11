import { useMemo, useCallback, useRef } from 'react';
import { IVintage, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { wineModel } from '@/entities/wine/WineModel';
import { localization } from '@/UIProvider/localization/Localization';
import { IVintageDropdownItem } from '../ui/components/VintageDropdown/types/IVintageDropdownItem';

export const NONE_VINTAGE_DROPDOWN_VALUE = '__NONE_VINTAGE__';

interface IProps {
    vintages: IVintagesItem[];
    currentVintage: IVintage | string | null;
    selectedVintage: number | null;
    onVintageChange: (item: IDropdownItem) => void;
}

export const useVintageDropdown = ({ vintages, currentVintage, selectedVintage, onVintageChange }: IProps) => {
    const dropdownRef = useRef<any>(null);
    const isVintageObject = (item: IVintagesItem): item is IVintage => typeof item === 'object' && item !== null;

    const vintageData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 2010;
        const yearsSet = new Set<number>();
        let hasAllOption = false;
        let shouldShowNoneVintage = false;
        let noneVintageWineId: number | undefined;

        const years: IVintageDropdownItem[] = [];
        const allVintagesLabel = localization.t('wine.allVintages');
        const noneVintageLabel = localization.t('wine.nonVintage');

        const ensureAllVintagesItem = () => {
            if (years.some(item => item.value === null)) return;
            hasAllOption = true;
            years.unshift({
                label: allVintagesLabel,
                value: null,
                hideRatingInfo: true,
            });
        };
        
        const ensureNoneVintageItem = (wineId?: number) => {
            if (years.some(item => item.value === NONE_VINTAGE_DROPDOWN_VALUE)) return;
            years.push({
                label: noneVintageLabel,
                value: NONE_VINTAGE_DROPDOWN_VALUE,
                id: wineId,
                hideRatingInfo: true,
            });
        };

        vintages.forEach(v => {
            if (typeof v === 'number') {
                yearsSet.add(v);
                years.push({
                    label: v.toString(),
                    value: v,
                });
                return;
            }

            if (typeof v === 'string') {
                if (v.toLowerCase() === 'all') {
                    ensureAllVintagesItem();
                    return;
                }

                const parsedValue = Number(v);
                if (!Number.isNaN(parsedValue)) {
                    yearsSet.add(parsedValue);
                    years.push({
                        label: parsedValue.toString(),
                        value: parsedValue,
                    });
                }
                return;
            }

            if (v.vintage === null) {
                shouldShowNoneVintage = true;
                noneVintageWineId = noneVintageWineId ?? v.wineId;
                return;
            }

            if (v.vintage !== null) {
                yearsSet.add(v.vintage);
                years.push({
                    label: v.vintage?.toString(),
                    value: v.vintage,
                    id: v.wineId,
                    averageUserRating: v.averageUserRating,
                    averageExpertRating: v.averageExpertRating,
                    totalReviews: v.totalReviews,
                    countExpertRating: v.countExpertRating,
                });
            }
        });

        if (currentVintage && typeof currentVintage === 'object' && currentVintage.vintage === null) {
            shouldShowNoneVintage = true;
            noneVintageWineId = noneVintageWineId ?? currentVintage.wineId;
        }

        if (currentVintage && typeof currentVintage === 'object' && currentVintage.vintage !== null && !yearsSet.has(currentVintage.vintage)) {
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

        ensureAllVintagesItem();

        if (shouldShowNoneVintage || (selectedVintage === null && !hasAllOption)) {
            ensureNoneVintageItem(noneVintageWineId);
        }

        years.sort((a, b) => {
            if (a.value === null) return -1;
            if (b.value === null) return 1;
            if (a.value === NONE_VINTAGE_DROPDOWN_VALUE) return -1;
            if (b.value === NONE_VINTAGE_DROPDOWN_VALUE) return 1;
            return (b.value as number) - (a.value as number);
        });

        return years;
    }, [vintages, currentVintage, selectedVintage]);

    const onCustomVintageAdd = useCallback(
        (year: number) => {
            const vintageInList = vintages.find((v): v is IVintage => isVintageObject(v) && v.vintage === year);

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
        return vintageData
            .map(item => item.value)
            .filter((value): value is number => typeof value === 'number');
    }, [vintageData]);

    const handleAddVintage = useCallback(
        (year: number, closeDropdown: () => void) => {
            wineModel.customVintage = year;
            onCustomVintageAdd(year);
            closeDropdown();
        },
        [onCustomVintageAdd],
    );

    const selectedValue = useMemo(() => {
        if (selectedVintage === null) {
            const hasNoneVintageOption = vintageData.some(item => item.value === NONE_VINTAGE_DROPDOWN_VALUE);
            return hasNoneVintageOption ? NONE_VINTAGE_DROPDOWN_VALUE : null;
        }

        return selectedVintage;
    }, [selectedVintage, vintageData]);

    return { vintageData, existingYears, handleAddVintage, dropdownRef, onCloseDropdown, selectedValue };
};
