import { ReactElement, useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Loader } from '@/UIKit/Loader';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { IWinePurchaseCard } from '@/modules/wine/types/IWinePurchaseCard';
import { useWineMarketplace } from '@/modules/wine/presenters/useWineMarketplace';
import { useRefresh } from '@/hooks/useRefresh';
import { WinePurchaseCard } from '../WinePurchaseCard';
import { getStyles } from './styles';
import { EmptyListView } from '@/UIKit/EmptyListView';

interface IProps {
    wineDetails: IWineDetails;
    headerComponent: ReactElement;
}

export const WineMarketplaceTab = ({ wineDetails, headerComponent }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { cards, isLoading, onRefresh } = useWineMarketplace(wineDetails.id, wineDetails);
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IWinePurchaseCard) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IWinePurchaseCard }) => {
        return <WinePurchaseCard item={item} />;
    }, []);

    return (
        <FlatList
            data={isLoading ? [] : cards}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            refreshControl={refreshControl}
            contentContainerStyle={styles.list}
            ListHeaderComponent={headerComponent}
            ListEmptyComponent={
                isLoading ? (
                    <View style={styles.loaderContainer}>
                        <Loader />
                    </View>
                ) : (
                    <EmptyListView text={t('wineMarketplace.noPurchaseOptions')} />
                )
            }
        />
    );
};
