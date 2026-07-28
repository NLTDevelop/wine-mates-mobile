import { ReactElement, useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Loader } from '@/UIKit/Loader';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWinePurchaseCard } from '@/modules/wine/types/IWinePurchaseCard';
import { useWineMarketplace } from '@/modules/wine/presenters/useWineMarketplace';
import { WinePurchaseCard } from '../WinePurchaseCard';
import { WinePartnerModal } from '../WinePartnerModal';
import { getStyles } from './styles';

interface IProps {
    wineDetails: IWineDetails;
    headerComponent: ReactElement;
}

export const WineMarketplaceTab = ({ wineDetails, headerComponent }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        cards,
        isLoading,
        selectedPartner,
        isPartnerModalVisible,
        onClosePartnerModal,
        onOpenPartnerWebsite,
    } = useWineMarketplace(wineDetails.id, wineDetails);

    const keyExtractor = useCallback((item: IWinePurchaseCard) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IWinePurchaseCard }) => {
        return <WinePurchaseCard item={item} />;
    }, []);

    return (
        <>
            <FlatList
                data={isLoading ? [] : cards}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListHeaderComponent={headerComponent}
                ListEmptyComponent={isLoading ? <Loader /> : null}
            />
            <WinePartnerModal
                visible={isPartnerModalVisible}
                partner={selectedPartner}
                onClose={onClosePartnerModal}
                onOpenWebsite={onOpenPartnerWebsite}
            />
        </>
    );
};
