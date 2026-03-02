import { useMemo, useCallback } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { StarIcon } from '@assets/icons/StartIcon';
import { TickIcon } from '@assets/icons/TickIcon';
import { declOfWord } from '@/utils';
import { IVintage } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { getStyles } from './styles';
import { wineModel } from '@/entities/wine/WineModel';

type VintageDropdownItem = Omit<IDropdownItem, 'value'> & {
    value: number | null;
    averageUserRating?: number;
    totalReviews?: number;
};

interface IProps {
    vintages: IVintage[];
    currentVintage: IVintage | null;
    selectedVintage: number | null;
    onVintageChange: (year: number) => void;
}

export const useVintageDropdown = ({ vintages, currentVintage, selectedVintage, onVintageChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const vintageData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 2010;
        const yearsSet = new Set<number>();

        const years: VintageDropdownItem[] = [
            {
                label: t('wine.withoutVintage'),
                value: null,
            }
        ];

        vintages.forEach(v => {
            if (v.vintage !== null) {
                yearsSet.add(v.vintage);
                years.push({
                    label: v.vintage.toString(),
                    value: v.vintage,
                    id: v.wineId,
                    averageUserRating: v.averageUserRating,
                    totalReviews: v.totalReviews,
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
                totalReviews: currentVintage.totalReviews,
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
    }, [vintages, currentVintage, t]);

    const selectedVintageValue = useMemo(() => {
        const found = vintageData.find(item => item.value === selectedVintage);

        if (!found) {
            return undefined;
        }

        if (currentVintage && found.value === currentVintage.vintage) {
            return {
                ...found,
                averageUserRating: currentVintage.averageUserRating,
                totalReviews: currentVintage.totalReviews,
            };
        }

        return found;
    }, [vintageData, selectedVintage, currentVintage]);

    const renderVintageValue = (dropdownItem: VintageDropdownItem) => {
        const rating = dropdownItem.averageUserRating ?? 0;
        const reviewsText = declOfWord(
            dropdownItem.totalReviews ?? 0,
            t('scanner.reviewCount') as unknown as Array<string>,
        );
        const displayLabel = dropdownItem.value === null ? '-' : dropdownItem.label;

        return (
            <View style={styles.rateContainer}>
                <Typography variant="subtitle_12_500" text={displayLabel} />
                {dropdownItem.averageUserRating !== undefined && (
                    <>
                        <StarIcon />
                        <Typography variant="subtitle_12_500" text={rating} />
                        <Typography variant="subtitle_12_400" text={`(${reviewsText})`} style={styles.text} />
                    </>
                )}
            </View>
        );
    };

    const renderVintageItemValue = (dropdownItem: VintageDropdownItem) => {
        const rating = dropdownItem.averageUserRating ?? 0;
        const reviewsText = declOfWord(
            dropdownItem.totalReviews ?? 0,
            t('scanner.reviewCount') as unknown as Array<string>,
        );

        return (
            <View style={styles.rateContainer}>
                <Typography variant="subtitle_12_500" text={dropdownItem.label} />
                {dropdownItem.averageUserRating !== undefined && (
                    <>
                        <StarIcon />
                        <Typography variant="subtitle_12_500" text={rating} />
                        <Typography variant="subtitle_12_400" text={`(${reviewsText})`} style={styles.text} />
                    </>
                )}
            </View>
        );
    };

    const renderVintageItem = (dropdownItem: VintageDropdownItem, selected?: boolean) => (
        <View style={styles.dropdownItem}>
            {renderVintageItemValue(dropdownItem)}
            {selected ? <TickIcon /> : null}
        </View>
    );

    const existingYears = useMemo(() => {
        return vintageData.map(item => item.value as number);
    }, [vintageData]);

    const handleAddVintage = useCallback((year: number, closeDropdown: () => void) => {
        wineModel.customVintage = year;
        onVintageChange(year);
        closeDropdown();
    }, [onVintageChange]);

    return {
        vintageData,
        selectedVintageValue,
        renderVintageValue,
        renderVintageItem,
        existingYears,
        handleAddVintage,
        styles,
    };
};
