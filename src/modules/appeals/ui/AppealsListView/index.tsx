import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { SearchBarWithFilter } from '@/UIKit/SearchBarWithFilter';
import { UniversalPickerBottomModal } from '@/UIKit/UniversalPickerBottomModal';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { useRefresh } from '@/hooks/useRefresh';
import { EmptyMessageIcon } from '@assets/icons/EmptyMessageIcon';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { IAppealListItem } from '@/modules/appeals/types/IAppealListItem';
import { AppealListItem } from './components/AppealListItem';
import { useAppealsList } from './presenters/useAppealsList';
import { getStyles } from './styles';

export const AppealsListView = observer(() => {
    const { colors, locale, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        listItems,
        search,
        status,
        statusFilterOptions,
        isStatusFilterVisible,
        isLoading,
        isLoadingMore,
        onSearchChange,
        onFilterPress,
        onCloseStatusFilter,
        onConfirmStatusFilter,
        onRefresh,
        onLoadMore,
        onCreatePress,
    } = useAppealsList(locale);
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IAppealListItem) => item.appeal.id.toString(), []);
    const renderItem = useCallback<ListRenderItem<IAppealListItem>>(
        ({ item }) => <AppealListItem appeal={item.appeal} onPress={item.onPress} />,
        [],
    );
    const addButton = (
        <TouchableOpacity style={styles.addButton} onPress={onCreatePress}>
            <PlusIcon color={colors.primary} />
        </TouchableOpacity>
    );

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('appeals.title')} isCentered rightComponent={addButton} />}
        >
            <View style={styles.container}>
                <SearchBarWithFilter
                    value={search}
                    onChangeText={onSearchChange}
                    onFilterPress={onFilterPress}
                    placeholder={t('appeals.searchPlaceholder')}
                    containerStyle={styles.search}
                />
                <FlatList
                    data={listItems}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    refreshControl={refreshControl}
                    onEndReached={onLoadMore}
                    onEndReachedThreshold={0.4}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <EmptyListView
                            image={<EmptyMessageIcon />}
                            text={t('appeals.empty')}
                            isLoading={isLoading}
                            isNothingFound={!isLoading && (!!search || !!status)}
                        />
                    }
                    ListFooterComponent={isLoadingMore ? <ListFooterLoader /> : null}
                />
            </View>
            {isStatusFilterVisible && (
                <UniversalPickerBottomModal
                    visible={isStatusFilterVisible}
                    title={t('appeals.statusFilterTitle')}
                    options={statusFilterOptions}
                    isLoading={false}
                    selectionMode="single"
                    emptyText={t('common.nothingFoundTitle')}
                    confirmText={t('common.confirm')}
                    onClose={onCloseStatusFilter}
                    onConfirm={onConfirmStatusFilter}
                />
            )}
        </ScreenContainer>
    );
});

AppealsListView.displayName = 'AppealsListView';
