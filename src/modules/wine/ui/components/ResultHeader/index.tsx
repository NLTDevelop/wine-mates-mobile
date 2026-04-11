import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IWineDetails, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import { useResultHeader } from '@/modules/wine/presenters/useResultHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { ResultHeaderFooter } from '../ResultHeaderFooter';

interface IProps {
    item: IWineDetails;
    vintages: IVintagesItem[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    isAllVintagesSelected: boolean;
    fromScanner?: boolean;
    hideReviewCount?: boolean;
}

export const ResultHeader = ({ item, vintages, onVintageChange, onFavoritePress, hasCurrentVintageData, isAllVintagesSelected, fromScanner, hideReviewCount }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress, isCreating } = useResultHeader(item, fromScanner);

    return (
        <View style={styles.cardWrapper}>
            <WineListItem
                item={item}
                footer={ <ResultHeaderFooter
                    item={item}
                    vintages={vintages}
                    onVintageChange={onVintageChange}
                    onFavoritePress={onFavoritePress}
                    hasCurrentVintageData={hasCurrentVintageData}
                    isAllVintagesSelected={isAllVintagesSelected}
                    onPress={onPress}
                    isCreating={isCreating}
                />}
                removeCardStyles
                hideReviewCount={false}
                showExpertRatingWithoutPremium={false}
            />
        </View>
    );
};
