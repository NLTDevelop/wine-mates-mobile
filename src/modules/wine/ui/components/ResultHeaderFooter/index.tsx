import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { IWineDetails, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { getStyles } from './styles';
import { VintageDropdown } from '../VintageDropdown';

interface IProps {
    item: IWineDetails;
    vintages: IVintagesItem[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    isAllVintagesSelected: boolean;
    onPress: () => void;
    isCreating: boolean;
}

export const ResultHeaderFooter = ({
    item,
    vintages,
    onVintageChange,
    onFavoritePress,
    hasCurrentVintageData,
    isAllVintagesSelected,
    onPress,
    isCreating,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.footerContainer}>
            <VintageDropdown
                vintages={vintages}
                currentVintage={item.currentVintage}
                selectedVintage={item.vintage}
                isAllVintagesSelected={isAllVintagesSelected}
                onVintageChange={onVintageChange}
            />
            <View style={styles.buttonTasteContainer}>
                <Button
                    text={hasCurrentVintageData && item.isTasted ? t('wine.tasteAgain') : t('wine.letsTaste')}
                    onPress={onPress}
                    type="secondary"
                    containerStyle={styles.button}
                    inProgress={isCreating}
                    disabled={isCreating || isAllVintagesSelected}
                    applyDisabledStyle={false}
                />
                <FavoriteButton onPress={onFavoritePress} disabled={isAllVintagesSelected} />
            </View>
        </View>
    );
};
