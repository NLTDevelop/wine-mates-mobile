import { IWineDetails, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { ResultHeader } from '@/modules/wine/ui/components/ResultHeader';
import { WineDetailsTabs } from '../WineDetailsTabs';

interface IProps {
    details: IWineDetails;
    vintages: IVintagesItem[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    isAllVintagesSelected: boolean;
    fromScanner?: boolean;
    isResultHeaderFooterVisible: boolean;
    showTastingAuthor: boolean;
    hasPremiumContentAccess: boolean;
    onWineImagePress?: () => void;
    isProfileActive: boolean;
    isEvolutionActive: boolean;
    isPurchaseActive: boolean;
    onProfilePress: () => void;
    onEvolutionPress: () => void;
    onPurchasePress: () => void;
    compactTabsBottomSpacing?: boolean;
}

export const WineDetailsScrollableHeader = ({
    details,
    vintages,
    onVintageChange,
    onFavoritePress,
    hasCurrentVintageData,
    isAllVintagesSelected,
    fromScanner,
    isResultHeaderFooterVisible,
    showTastingAuthor,
    hasPremiumContentAccess,
    onWineImagePress,
    isProfileActive,
    isEvolutionActive,
    isPurchaseActive,
    onProfilePress,
    onEvolutionPress,
    onPurchasePress,
    compactTabsBottomSpacing = false,
}: IProps) => {
    return (
        <>
            <ResultHeader
                item={details}
                vintages={vintages}
                onVintageChange={onVintageChange}
                onFavoritePress={onFavoritePress}
                hasCurrentVintageData={hasCurrentVintageData}
                isAllVintagesSelected={isAllVintagesSelected}
                fromScanner={fromScanner}
                isResultHeaderFooterVisible={isResultHeaderFooterVisible}
                showTastingAuthor={showTastingAuthor}
                hasPremiumContentAccess={hasPremiumContentAccess}
                onWineImagePress={onWineImagePress}
            />
            <WineDetailsTabs
                isProfileActive={isProfileActive}
                isEvolutionActive={isEvolutionActive}
                isPurchaseActive={isPurchaseActive}
                onProfilePress={onProfilePress}
                onEvolutionPress={onEvolutionPress}
                onPurchasePress={onPurchasePress}
                compactBottomSpacing={compactTabsBottomSpacing}
            />
        </>
    );
};
