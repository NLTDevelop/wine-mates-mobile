import { useUiContext } from '@/UIProvider';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, View } from 'react-native';
import { getStyles } from './styles';
import { useMyWine } from '@/modules/wineAndStyles/presenters/useMyWine';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { AnimatedWineListItem } from './components/AnimatedWineListItem';
import { useRefresh } from '@/hooks/useRefresh';
import { observer } from 'mobx-react-lite';
import { MyWineSearchBar } from './components/MyWineSearchBar';
import { WineReviewBlock } from '@/UIKit/WineReviewBlock';

export const MyWine = observer(() => {
    const { colors , t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const listRef = useRef<FlatList>(null);

    const { data, onRefresh, onEndReached, onItemPress, isLoading, getList, setScrollToTop, scrollToTop } = useMyWine();
    const { refreshControl } = useRefresh(onRefresh);

    const handleScrollToTop = useCallback(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, []);

    useEffect(() => {
        setScrollToTop(() => handleScrollToTop);
    }, [handleScrollToTop, setScrollToTop]);

    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);
    
    const renderFooter = useCallback((item: IWineListItem) => {
        const lastReviewData = item.lastRate || item.lastReview;
        if (!lastReviewData) return null;

        return <WineReviewBlock user={lastReviewData.user} review={lastReviewData.review} isMyReview={true}/>;
    }, []);

    const renderItem = useCallback(({ item, index }: { item: IWineListItem; index: number }) => {
        return <AnimatedWineListItem item={item} index={index} onPress={onItemPress} footer={renderFooter(item)} />;
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
