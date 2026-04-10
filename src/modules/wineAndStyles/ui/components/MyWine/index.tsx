import { useUiContext } from '@/UIProvider';
import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { getStyles } from './styles';
import { useMyWine } from '@/modules/wineAndStyles/presenters/useMyWine';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { useRefresh } from '@/hooks/useRefresh';
import { observer } from 'mobx-react-lite';
import { MyWineSearchBar } from '../MyWineSearchBar';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';
import { WineListItem } from '@/UIKit/WineListItem';

export const MyWine = observer(() => {
    const { colors , t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, onRefresh, onEndReached, onItemPress, isLoading, getList, listRef, scrollToTop } = useMyWine();
    const { refreshControl } = useRefresh(onRefresh);

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);

    const renderFooter = useCallback((item: IWineListItem) => {
        if (!item.myReview) return null;

        return <WineReviewBlock user={item.myReview.user} review={item.myReview.review}/>;
    }, []);

    const renderItem = useCallback(({ item }: { item: IWineListItem; index: number }) => {
        return <WineListItem item={item} onPress={onItemPress} showDate showVintage showNonVintage footer={renderFooter(item)} hideReviewCount showExpertRatingWithoutPremium />;
    }, [onItemPress, renderFooter]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MyWineSearchBar onSearch={getList} scrollToTop={scrollToTop} />
            </View>
            <FlatList
                ref={listRef}
                refreshControl={refreshControl}
                data={data || []}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReached={onEndReached}
                style={styles.list}
                contentContainerStyle={styles.containerStyle}
                keyboardShouldPersistTaps="handled"
                ListFooterComponent={isLoading && data?.length ? <ListFooterLoader /> : null}
                ListEmptyComponent={
                    <EmptyListView
                        isLoading={isLoading}
                        image={<EmptyWineListIcon />}
                        text={t('common.nothingFoundTitle')}
                    />
                }
            />
        </View>
    );
});
