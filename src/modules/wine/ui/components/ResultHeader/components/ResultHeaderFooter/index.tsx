import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Button } from '@/UIKit/Button';
import { FavoriteButton } from '@/UIKit/FavoriteButton';
import { IWineDetails, IVintage } from '@/entities/wine/types/IWineDetails';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { VintageDropdown } from '../../../VintageDropdown';
import { getStyles } from './styles';

interface IProps {
    item: IWineDetails;
    vintages: IVintage[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    onPress: () => void;
    isCreating: boolean;
}

export const ResultHeaderFooter = ({ item, vintages, onVintageChange, onFavoritePress, hasCurrentVintageData, onPress, isCreating }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.footerContainer}>
            <VintageDropdown
                vintages={vintages}
                currentVintage={item.currentVintage}
                selectedVintage={item.vintage}
                onVintageChange={onVintageChange}
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
                <FavoriteButton onPress={onFavoritePress} />
            </View>
        </View>
    );
};
