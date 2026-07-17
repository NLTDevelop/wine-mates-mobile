import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { observer } from 'mobx-react-lite';
import { IAvailableWineryWine } from '@/entities/winery/types/IAvailableWineryWine';
import { ErrorTypeEnum } from '@/entities/appState/enums/ErrorTypeEnum';
import { useRefresh } from '@/hooks/useRefresh';
import { useUiContext } from '@/UIProvider';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { WithErrorHandler } from '@/UIKit/ErrorHandler';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { AddWineryWineAlert } from './components/AddWineryWineAlert';
import { AvailableWineryWineListItem } from './components/AvailableWineryWineListItem';
import { useAddWineryWines } from './presenters/useAddWineryWines';
import { getStyles } from './styles';

export const AddWineryWinesView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        wines,
        selectedWine,
        isLoading,
        isLoadingMore,
        isAdding,
        isError,
        onRefresh,
        onLoadMore,
        onWinePress,
        onCloseAlert,
        onConfirmAdd,
        onPressBack,
    } = useAddWineryWines();
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IAvailableWineryWine) => item.id.toString(), []);
    const renderItem = useCallback<ListRenderItem<IAvailableWineryWine>>(
        ({ item }) => <AvailableWineryWineListItem item={item} onPress={onWinePress} />,
        [onWinePress],
    );

    return (
        <WithErrorHandler error={isError ? ErrorTypeEnum.ERROR : null} onRetry={onRefresh}>
            <ScreenContainer
                edges={['top', 'bottom']}
                withGradient
                headerComponent={
                    <HeaderWithBackButton title={t('profile.addWineToWinery')} onPressBack={onPressBack} />
                }
            >
                <FlatList
                    data={wines}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    refreshControl={refreshControl}
                    onEndReached={onLoadMore}
                    onEndReachedThreshold={0.4}
                    style={styles.list}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
                    ListEmptyComponent={
                        <EmptyListView
                            isLoading={isLoading}
                            image={<EmptyWineListIcon />}
                            text={t('profile.noAvailableWineryWines')}
                        />
                    }
                />
                {!!selectedWine && (
                    <AddWineryWineAlert
                        visible
                        wineName={selectedWine.name}
                        isLoading={isAdding}
                        onClose={onCloseAlert}
                        onConfirm={onConfirmAdd}
                    />
                )}
            </ScreenContainer>
        </WithErrorHandler>
    );
});
