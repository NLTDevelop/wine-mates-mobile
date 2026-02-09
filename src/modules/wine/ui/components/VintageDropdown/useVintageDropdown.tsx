import { useMemo, useCallback, useState } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { StarIcon } from '@assets/icons/StartIcon';
import { TickIcon } from '@assets/icons/TickIcon';
import { declOfWord } from '@/utils';
import { IVintage } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { getStyles } from './styles';

type VintageDropdownItem = IDropdownItem & {
    averageUserRating?: number;
    totalReviews?: number;
};

interface IProps {
    vintages: IVintage[];
    currentVintage: IVintage | null;
    selectedVintage: number;
    onVintageChange: (year: number) => void;
}

export const useVintageDropdown = ({ vintages, currentVintage, selectedVintage, onVintageChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const [customVintages, setCustomVintages] = useState<number[]>([]);

    const vintageData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 2010;
        
        const vintageMap = new Map<number, IVintage>();
        
        vintages.forEach(v => {
            vintageMap.set(v.vintage, v);
        });
        
        if (currentVintage) {
            vintageMap.set(currentVintage.vintage, currentVintage);
        }

        const years: VintageDropdownItem[] = [];
        
        for (let year = currentYear; year >= startYear; year--) {
            const vintage = vintageMap.get(year);
            
            if (vintage) {
                years.push({
                    label: year.toString(),
                    value: year,
                    id: vintage.wineId,
                    averageUserRating: vintage.averageUserRating,
                    totalReviews: vintage.totalReviews,
                });
            } else {
                years.push({
                    label: year.toString(),
                    value: year,
                });
            }
        }
        
        if (currentVintage && (currentVintage.vintage < startYear || currentVintage.vintage > currentYear)) {
            if (!years.find(y => y.value === currentVintage.vintage)) {
                years.push({
                    label: currentVintage.vintage.toString(),
                    value: currentVintage.vintage,
                    id: currentVintage.wineId,
                    averageUserRating: currentVintage.averageUserRating,
                    totalReviews: currentVintage.totalReviews,
                });
            }
        }
        
        vintages.forEach(v => {
            if (v.vintage < startYear || v.vintage > currentYear) {
                if (!years.find(y => y.value === v.vintage)) {
                    years.push({
                        label: v.vintage.toString(),
                        value: v.vintage,
                        id: v.wineId,
                        averageUserRating: v.averageUserRating,
                        totalReviews: v.totalReviews,
                    });
                }
            }
        });
        
        customVintages.forEach(year => {
            if (!years.find(y => y.value === year)) {
                years.push({
                    label: year.toString(),
                    value: year,
                });
            }
        });
        
        years.sort((a, b) => (a.value as number) - (b.value as number));

        return years;
    }, [vintages, currentVintage, customVintages]);

    const selectedVintageValue = useMemo(() => {
        const found = vintageData.find(item => item.value === selectedVintage);
        
        if (found && currentVintage && found.value === currentVintage.vintage) {
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
            {renderVintageValue(dropdownItem)}
            {selected ? <TickIcon /> : null}
        </View>
    );

    const existingYears = useMemo(() => {
        return vintageData.map(item => item.value as number);
    }, [vintageData]);

    const handleAddVintage = useCallback((year: number, closeDropdown: () => void) => {
        setCustomVintages(prev => [...prev, year]);
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
