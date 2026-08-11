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
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';

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
    onWineImagePress?: () => void;
}

export const ResultHeader = ({
    item,
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
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { onPress, isCreating, isVintageAlertVisible, onCloseVintageAlert } = useResultHeader(
        item,
        fromScanner,
        isAllVintagesSelected,
    );
    const { isShareModalVisible, onOpenShareModal, onCloseShareModal, onShareMessengerPress, onCopyWineLinkPress } =
        useWineShareModal();

    return (
        <View style={styles.cardWrapper}>
            <WineListItem
                item={item}
                onSharePress={onOpenShareModal}
                onImagePress={onWineImagePress}
                footer={
                    isResultHeaderFooterVisible ? (
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
                    ) : undefined
                }
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
            <CustomAlert
                visible={isVintageAlertVisible}
                onClose={onCloseVintageAlert}
                header={t('wine.selectVintageForTastingTitle')}
                content={
                    <Typography
                        variant="body_400"
                        text={t('wine.selectVintageForTastingDescription')}
                        style={styles.vintageAlertDescription}
                    />
                }
                footer={
                    <Button
                        text={t('common.ok')}
                        onPress={onCloseVintageAlert}
                        containerStyle={styles.vintageAlertButton}
                    />
                }
            />
        </View>
    );
};
