import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { FavoriteIcon } from '@assets/icons/FavoriteIcon';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { useResultHeader } from '@/modules/wine/presenters/useResultHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { VintageDropdown } from '../VintageDropdown';
import { WineListItem } from '@/UIKit/WineListItem';
import { useResultHeaderLogic } from './useResultHeaderLogic';

interface IProps {
    item: IWineDetails;
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    clearCustomVintage: () => void;
    setClearCustomVintagesFn: (fn: () => void) => void;
    clearAllCustomVintages: () => void;
}

export const ResultHeader = ({ item, onVintageChange, onFavoritePress, hasCurrentVintageData, clearCustomVintage, setClearCustomVintagesFn, clearAllCustomVintages }: IProps) => {
    const { t } = useUiContext();
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress, isCreating } = useResultHeader(item, clearCustomVintage, clearAllCustomVintages);
    const { description } = useResultHeaderLogic({ item, styles });

    const footer = useMemo(() => (
        <View style={styles.footerContainer}>
            <VintageDropdown
                vintages={item.vintages}
                currentVintage={item.currentVintage}
                selectedVintage={item.vintage}
                onVintageChange={onVintageChange}
                onClearCustomVintages={setClearCustomVintagesFn}
            />
            <View style={styles.buttonTasteContainer}>
                <Button
                    text={hasCurrentVintageData && item.isTasted ? t('wine.tasteAgain') : t('wine.letsTaste')}
                    onPress={onPress}
                    type="secondary"
                    containerStyle={styles.button}
                    inProgress={isCreating}
                    disabled={isCreating}
                />
                <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
                    <FavoriteIcon />
                </TouchableOpacity>
            </View>
        </View>
    ), [item.vintages, item.currentVintage, item.vintage, onVintageChange, hasCurrentVintageData, item.isTasted, t, onPress, isCreating, onFavoritePress, styles.footerContainer, styles.buttonTasteContainer, styles.button, styles.favoriteButton]);

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
