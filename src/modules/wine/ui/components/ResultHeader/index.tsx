import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IWineDetails, IVintagesItem } from '@/entities/wine/types/IWineDetails';
import { useResultHeader } from '@/modules/wine/presenters/useResultHeader';
import { IDropdownItem } from '@/UIKit/CustomDropdown/types/IDropdownItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { ResultHeaderFooter } from '../ResultHeaderFooter';
import { WineShareModal } from '@/UIKit/WineShareModal';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';

interface IProps {
    item: IWineDetails;
    vintages: IVintagesItem[];
    onVintageChange: (item: IDropdownItem) => void;
    onFavoritePress: () => void;
    hasCurrentVintageData: boolean;
    isAllVintagesSelected: boolean;
    fromScanner?: boolean;
    isResultHeaderFooterVisible: boolean;
    showTastingAuthor: boolean;
    hasPremiumContentAccess: boolean;
}

export const ResultHeader = ({ item, vintages, onVintageChange, onFavoritePress, hasCurrentVintageData,
    isAllVintagesSelected, fromScanner, isResultHeaderFooterVisible, showTastingAuthor,
    hasPremiumContentAccess }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress, isCreating } = useResultHeader(item, fromScanner);
    const {
        isShareModalVisible,
        onOpenShareModal,
        onCloseShareModal,
        onShareMessengerPress,
        onCopyWineLinkPress,
    } = useWineShareModal();

    return (
        <View style={styles.cardWrapper}>
            <WineListItem
                item={item}
                onSharePress={onOpenShareModal}
                footer={isResultHeaderFooterVisible ? (
                    <ResultHeaderFooter
                        item={item}
                        vintages={vintages}
                        onVintageChange={onVintageChange}
                        onFavoritePress={onFavoritePress}
                        hasCurrentVintageData={hasCurrentVintageData}
                        isAllVintagesSelected={isAllVintagesSelected}
                        onPress={onPress}
                        isCreating={isCreating}
                        hasPremiumContentAccess={hasPremiumContentAccess}
                    />
                ) : undefined}
                removeCardStyles
                showExpertRatingWithoutPremium={hasPremiumContentAccess}
                hideDate
                showTastingAuthor={showTastingAuthor}
            />
            <WineShareModal
                visible={isShareModalVisible}
                onClose={onCloseShareModal}
                onShareMessengerPress={onShareMessengerPress}
                onCopyLinkPress={onCopyWineLinkPress}
            />
        </View>
    );
};
