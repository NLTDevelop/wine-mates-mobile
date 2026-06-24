import { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { SearchBar } from '@/UIKit/SearchBar';
import { WineListItem } from '@/UIKit/WineListItem';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { useChooseWineResults } from '../../presenters/useChooseWineResults';
import { getStyles } from './styles';
import { ResultsFilterButton } from './components/ResultsFilterButton';
import { WineShareModal } from '@/UIKit/WineShareModal';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';

export const ChooseWineResultsView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        title,
        searchQuery,
        wines,
        isLoading,
        isRefreshing,
        isLoadingMore,
        appliedFiltersCount,
        onSearchChange,
        onRefresh,
        onEndReached,
        onWinePress,
        onFilterPress,
    } = useChooseWineResults();
    const {
        isShareModalVisible,
        onOpenShareModal,
        onCloseShareModal,
        onShareMessengerPress,
        onCopyWineLinkPress,
    } = useWineShareModal();

    const keyExtractor = useCallback((item: IWineListItem, index: number) => {
        return `${item.id}-${index}`;
    }, []);

    const renderItem = useCallback(({ item }: { item: IWineListItem }) => {
        return (
            <WineListItem
                item={item}
                onPress={onWinePress}
                onSharePress={onOpenShareModal}
                showDate
                showVintage
                showNonVintage
            />
        );
    }, [onOpenShareModal, onWinePress]);

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={title} />}
            containerStyle={styles.screen}
        >
            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholder={t('chooseWine.searchWine')}
                    containerStyle={styles.search}
                />
                <ResultsFilterButton count={appliedFiltersCount} onPress={onFilterPress} />
            </View>
            <FlatList
                data={wines}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                style={styles.list}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.contentContainer}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.4}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
                ListEmptyComponent={
                    <EmptyListView
                        isLoading={isLoading}
                        image={<EmptyWineListIcon />}
                        text={t('chooseWine.noResults')}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
            <WineShareModal
                visible={isShareModalVisible}
                onClose={onCloseShareModal}
                onShareMessengerPress={onShareMessengerPress}
                onCopyLinkPress={onCopyWineLinkPress}
            />
        </ScreenContainer>
    );
});
