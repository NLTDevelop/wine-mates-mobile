import { useUiContext } from '@/UIProvider';
import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { getStyles } from './styles';
import { useMyWine } from '@/modules/wineAndStyles/presenters/useMyWine';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { EmptyWineListIcon } from '@assets/icons/EmptyWineListIcon';
import { IWineListItem } from '@/entities/wine/types/IWineListItem';
import { WineListItem } from '@/UIKit/WineListItem';
import { useRefresh } from '@/hooks/useRefresh';
import { observer } from 'mobx-react-lite';
import { MyWineSearchBar } from './components/MyWineSearchBar';

export const MyWine = observer(() => {
    const { colors , t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { data, onRefresh, onEndReached, onItemPress, isLoading, getList } = useMyWine();
    const { refreshControl } = useRefresh(onRefresh);
    
    const keyExtractor = useCallback((item: IWineListItem, index: number) => `${item.id}-${index}`, []);
    const renderItem = useCallback(({ item }: { item: IWineListItem }) => {
        return <WineListItem item={item} onPress={onItemPress} hideSimilarity showDate />;
    }, [onItemPress]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MyWineSearchBar onSearch={getList} />
            </View>
            <FlatList
                refreshControl={refreshControl}
                data={data || []}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReached={onEndReached}
                style={styles.list}
                contentContainerStyle={styles.containerStyle}
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
