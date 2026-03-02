import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IWineDetails, IVintage } from '@/entities/wine/types/IWineDetails';
import { useResultHeader } from '@/modules/wine/presenters/useResultHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { useResultHeaderLogic } from './useResultHeaderLogic';
import { ResultHeaderFooter } from './components/ResultHeaderFooter';

interface IProps {
    item: IWineDetails;
    vintages: IVintage[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
}

export const ResultHeader = ({ item, vintages, onVintageChange, onFavoritePress, hasCurrentVintageData }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress, isCreating } = useResultHeader(item);
    const { description } = useResultHeaderLogic({ item, styles });

    const footer = useMemo(() => (
        <ResultHeaderFooter
            item={item}
            vintages={vintages}
            onVintageChange={onVintageChange}
            onFavoritePress={onFavoritePress}
            hasCurrentVintageData={hasCurrentVintageData}
            onPress={onPress}
            isCreating={isCreating}
        />
    ), [item, vintages, onVintageChange, onFavoritePress, hasCurrentVintageData, onPress, isCreating]);

    return (
        <View style={styles.cardWrapper}>
            <WineListItem
                item={item}
                hideSimilarity={true}
                footer={footer}
                wineName={description}
                removeCardStyles
            />
        </View>
    );
};
