import { useMemo, useEffect } from 'react';
import { View, FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { WineEventListItem } from '@/modules/event/components/WineEventList/components/WineEventListItem';
import { useEventsList } from '@/modules/event/presenters/useEventsList';
import { IEvent } from '@/entities/events/types/IEvent';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { ListFooterLoader } from '@/UIKit/ListFooterLoader';

export const EventsListView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();

    const {
        events,
        isLoading,
        isRefreshing,
        hasMore,
        loadEvents,
        onRefresh,
        onLoadMore,
    } = useEventsList();

    useEffect(() => {
        loadEvents(true);
    }, []);

    const onReadMorePress = (eventId: number) => {
        navigation.navigate('EventDetails', { eventId });
    };

    const onFavoritePress = (eventId: number) => {
        console.log('Favorite pressed:', eventId);
        // TODO: Implement favorite functionality
    };

    const renderItem: ListRenderItem<IEvent> = ({ item }) => (
        <WineEventListItem
            event={item}
            isSelected={false}
            onReadMorePress={onReadMorePress}
            onFavoritePress={onFavoritePress}
            eventId={item.id}
        />
    );

    const keyExtractor = (item: IEvent) => item.id.toString();

    return (
        <ScreenContainer
            edges={[]}
            scrollEnabled={false}
            headerComponent={<HeaderWithBackButton title={t('eventMap.wineEvents')} isCentered={false} />}
        >
            <View style={styles.container}>
                {/*<FlatList*/}
                {/*    data={events}*/}
                {/*    renderItem={renderItem}*/}
                {/*    keyExtractor={keyExtractor}*/}
                {/*    contentContainerStyle={styles.listContainer}*/}
                {/*    showsVerticalScrollIndicator={false}*/}
                {/*    refreshControl={*/}
                {/*        <RefreshControl*/}
                {/*            refreshing={isRefreshing}*/}
                {/*            onRefresh={onRefresh}*/}
                {/*            tintColor={colors.primary}*/}
                {/*        />*/}
                {/*    }*/}
                {/*    onEndReached={onLoadMore}*/}
                {/*    onEndReachedThreshold={0.5}*/}
                {/*    ListFooterComponent={isLoading && hasMore ? <ListFooterLoader /> : null}*/}
                {/*/>*/}
            </View>
        </ScreenContainer>
    );
});

EventsListView.displayName = 'EventsListView';
