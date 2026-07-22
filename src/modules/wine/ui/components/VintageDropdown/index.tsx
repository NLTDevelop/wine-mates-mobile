import { useCallback, useMemo } from 'react';
import { CustomDropdown } from '@/UIKit/CustomDropdown/ui';
import { IVintage, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { NONE_VINTAGE_DROPDOWN_VALUE, useVintageDropdown } from '../../../presenters/useVintageDropdown';
import { CustomVintageFooter } from '../CustomVintageFooter';
import { getStyles } from './styles';
import { View } from 'react-native';
import { StarIcon } from '@assets/icons/StartIcon';
import { Typography } from '@/UIKit/Typography';
import { RateMedal } from '@/UIKit/RateMedal/ui';
import { ShowLock } from '@/UIKit/ShowLock';
import { TickIcon } from '@assets/icons/TickIcon';
import { useUiContext } from '@/UIProvider';
import { IVintageDropdownItem } from './types/IVintageDropdownItem';

interface IProps {
    vintages: IVintagesItem[];
    currentVintage: IVintage | string | null;
    selectedVintage: number | string | null;
    isAllVintagesSelected: boolean;
    onVintageChange: (item: IDropdownItem) => void;
    hasPremiumContentAccess: boolean;
}

export const VintageDropdown = ({ vintages, currentVintage, selectedVintage, isAllVintagesSelected, onVintageChange, hasPremiumContentAccess }: IProps) => {
    const { colors, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { vintageData, existingYears, onAddVintage, dropdownRef, selectedValue } =
        useVintageDropdown({
            vintages,
            currentVintage,
            selectedVintage: typeof selectedVintage === 'number' ? selectedVintage : null,
            isAllVintagesSelected,
            onVintageChange,
            locale,
        });

    const renderRatingInfo = useCallback((dropdownItem: IVintageDropdownItem) => {
        if (dropdownItem.hideRatingInfo || dropdownItem.value === null || dropdownItem.value === NONE_VINTAGE_DROPDOWN_VALUE) {
            return null;
        }

        const userRating = dropdownItem.averageUserRating ?? null;
        const expertRating = dropdownItem.averageExpertRating ?? null;

        const hasUserRating = userRating !== null;
        const hasExpertRating = expertRating !== null && expertRating >= 70;

        if (!hasUserRating && !hasExpertRating) {
            return null;
        }

        return (
            <View style={styles.ratingInfoContainer}>
                {hasUserRating ? (
                    <View style={styles.ratingItem}>
                        <StarIcon />
                        <Typography variant="subtitle_12_500" text={userRating.toFixed(1)} />
                    </View>
                ) : null}

                {hasExpertRating ? (
                    hasPremiumContentAccess ? (
                        <View style={styles.ratingItem}>
                            <RateMedal sliderValue={expertRating} size={16} hideText />
                            <Typography variant="subtitle_12_500" text={expertRating.toFixed(1)} />
                        </View>
                    ) : (
                        <ShowLock iconSize={16} />
                    )
                ) : null}
            </View>
        );
    }, [hasPremiumContentAccess, styles]);

    const renderVintageContent = useCallback((dropdownItem: IVintageDropdownItem) => {
        return (
            <View style={styles.rateContainer}>
                <Typography variant="subtitle_12_500" text={dropdownItem.label} />
                {renderRatingInfo(dropdownItem)}
            </View>
        );
    }, [renderRatingInfo, styles.rateContainer]);

    const renderVintageItem = useCallback((dropdownItem: IVintageDropdownItem, selected?: boolean) => {
        return (
            <View style={styles.dropdownItem}>
                {renderVintageContent(dropdownItem)}
                {selected ? <TickIcon /> : null}
            </View>
        );
    }, [renderVintageContent, styles.dropdownItem]);

    const renderFooter = useCallback(() => {
        return (
            <CustomVintageFooter
                existingYears={existingYears}
                onAddVintage={onAddVintage}
            />
        );
    }, [existingYears, onAddVintage]);

    return (
        <CustomDropdown
            ref={dropdownRef}
            data={vintageData}
            placeholder=""
            onPress={onVintageChange}
            selectedValue={selectedValue}
            containerStyle={styles.dropdown}
            disabled={vintageData.length === 0}
            renderItem={renderVintageItem}
            renderSelectedValue={renderVintageContent}
            renderFooter={renderFooter}
        />
    );
};
