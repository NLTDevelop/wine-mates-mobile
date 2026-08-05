import { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { ResultHeader } from '../components/ResultHeader';
import { IPrivateOfferListItem } from '../../types/IPrivateOfferListItem';
import { usePrivateWineOffers } from '../../presenters/usePrivateWineOffers';
import { PrivateOfferItem } from './components/PrivateOfferItem';
import { OffersFilterButton } from './components/OffersFilterButton';
import { PriceFilterModal } from './components/PriceFilterModal';
import { getStyles } from './styles';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { useRefresh } from '@/hooks/useRefresh';

export const PrivateWineOffersView = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        wineDetails,
        items,
        isLoading,
        isLoadingMore,
        isFilterVisible,
        draftMinPrice,
        draftMaxPrice,
        priceMin,
        priceMax,
        priceCurrency,
        filterCount,
        onOpenFilter,
        onCloseFilter,
        onPriceRangeChange,
        onApplyFilter,
        onRefresh,
        onEndReached,
        onVintageChange,
        onFavoritePress,
    } = usePrivateWineOffers();
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IPrivateOfferListItem) => `${item.id}`, []);
    const renderItem = useCallback(({ item }: { item: IPrivateOfferListItem }) => {
        return <PrivateOfferItem item={item} />;
    }, []);

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={
                <HeaderWithBackButton
                    title={t('wineMarketplace.privateOffers')}
                    isCentered={false}
                    rightComponent={<OffersFilterButton count={filterCount} onPress={onOpenFilter} />}
                />
            }
        >
            <FlatList
                data={items}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                refreshControl={refreshControl}
                contentContainerStyle={styles.list}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.4}
                ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
                ListEmptyComponent={<EmptyListView isLoading={isLoading} isNothingFound={!isLoading} />}
                ListHeaderComponent={
                    <ResultHeader
                        item={wineDetails}
                        vintages={[]}
                        onVintageChange={onVintageChange}
                        onFavoritePress={onFavoritePress}
                        hasCurrentVintageData={false}
                        isAllVintagesSelected={false}
                        isResultHeaderFooterVisible={false}
                        showTastingAuthor={false}
                        hasPremiumContentAccess
                    />
                }
            />
            <PriceFilterModal
                visible={isFilterVisible}
                min={priceMin}
                max={priceMax}
                minValue={draftMinPrice}
                maxValue={draftMaxPrice}
                currency={priceCurrency}
                onChange={onPriceRangeChange}
                onClose={onCloseFilter}
                onApply={onApplyFilter}
            />
        </ScreenContainer>
    );
};
