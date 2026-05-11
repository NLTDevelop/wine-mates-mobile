import { useCallback, useMemo } from 'react';
import { FlatList, Image, View } from 'react-native';
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { observer } from 'mobx-react';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { TabsBar } from '../EventDetailsView/components/TabsBar';
import { size } from '@/utils';
import { getStyles } from './styles';
import { useEventListView } from './presenters/useEventListView';
import { useEventsList } from './presenters/useEventList';
import { IEvent } from '@/entities/events/types/IEvent';
import { ISavedEvent } from '@/entities/events/types/ISavedEvent';
import { IAppliedEvent } from '@/entities/events/types/IAppliedEvent';
import { EventCard } from '@/UIKit/EventCard';
import { useRefresh } from '@/hooks/useRefresh';
import { EmptyListView } from '@/UIKit/EmptyListView';
import { Loader } from '@/UIKit/Loader';

interface IRoute {
    key: 'created' | 'saved' | 'applied';
    title: string;
}

interface ISceneProps {
    route: IRoute;
}

export const EventListView = observer(() => {
    const { t, colors } = useUiContext();
    const { screenIndex, routes, onIndexChange, onReadMorePress } = useEventListView({ t });
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {savedEvents,
        createdEvents,
        appliedEvents,
        isLoading,
        onRefresh,
        onLoadMoreSaved,
        onLoadMoreCreated,
        onFavoritePress,
    } = useEventsList()

    const refresh = useRefresh(onRefresh);    
    const keyCreatedExtractor = useCallback((item: IEvent, index: number) => `${item.id || index}`, []);
    const keySavedExtractor = useCallback((item: ISavedEvent, index: number) => `${item.id || index}`, []);
    const keyAppliedExtractor = useCallback((item: IAppliedEvent, index: number) => `${item.id || index}`, []);

    const emptyList = (<EmptyListView
                                image={<Image source={require('@assets/images/city_search.jpeg')} style={styles.emptyImage} />}
                                text={'Empty event list'}
                                isLoading={isLoading}
                            />);

    const onRenderCreatedItem = useCallback(
        ({ item }: { item: IEvent }) => (
            <EventCard
                event={item}
                isSelected={false}
                onReadMorePress={onReadMorePress}
                showEditButton
                onFavoritePress={onFavoritePress}
            />
        ),
        [onFavoritePress, onReadMorePress],
    );

    const onRenderSavedItem = useCallback(
        ({ item }: { item: ISavedEvent }) => (
            <EventCard
                event={item}
                isSelected={false}
                onReadMorePress={onReadMorePress}
                onFavoritePress={onFavoritePress}
            />
        ),
        [onFavoritePress, onReadMorePress],
    );

    const onRenderAppliedItem = useCallback(
        ({ item }: { item: IAppliedEvent }) => (
            <EventCard
                event={item.event}
                isSelected={false}
                onReadMorePress={onReadMorePress}
                appliedEventStatus={item.status}
                onFavoritePress={onFavoritePress}
            />
        ),
        [onFavoritePress, onReadMorePress],
    );

    const renderScene = function renderScene({ route: sceneRoute }: ISceneProps) {
        if(isLoading){
            return <Loader/>;
        }
        if (sceneRoute.key === 'created') {
            return <FlatList
                                        data={createdEvents?.rows || []}
                                        keyExtractor={keyCreatedExtractor}
                                        renderItem={onRenderCreatedItem}
                                        refreshControl={refresh.refreshControl}
                                        contentContainerStyle={styles.containerStyle}
                                         ListEmptyComponent={emptyList}
                                         onEndReached={onLoadMoreCreated}
                                         
                                    />;
        }
        if (sceneRoute.key === 'saved') {
            return <FlatList
                                        data={savedEvents?.rows || []}
                                        keyExtractor={keySavedExtractor}
                                        renderItem={onRenderSavedItem}
                                        refreshControl={refresh.refreshControl}
                                        contentContainerStyle={styles.containerStyle}
                                        ListEmptyComponent={emptyList}
                                        onEndReached={onLoadMoreSaved}
                                
                                    />;
        }
        if (sceneRoute.key === 'applied') {
            return <FlatList
                                        data={appliedEvents || []}
                                        keyExtractor={keyAppliedExtractor}
                                        renderItem={onRenderAppliedItem}
                                        refreshControl={refresh.refreshControl}
                                        contentContainerStyle={styles.containerStyle}
                                         ListEmptyComponent={emptyList}
                                    />;
        }

        return <FlatList
                                        data={createdEvents?.rows || []}
                                        keyExtractor={keyCreatedExtractor}
                                        renderItem={onRenderCreatedItem}
                                        refreshControl={refresh.refreshControl}
                                        contentContainerStyle={styles.containerStyle}
                                         ListEmptyComponent={emptyList}
                                    />;
    };

    const renderTabBar = function renderTabBar(props: SceneRendererProps & { navigationState: NavigationState<IRoute> }) {
        return <TabsBar tabBarProps={props} onIndexChange={onIndexChange} />;
    };

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('event.listTitle')} />}
        >
            <View style={styles.container}>
                <TabView
                    lazy
                    swipeEnabled
                    renderTabBar={renderTabBar}
                    navigationState={{ index: screenIndex, routes }}
                    renderScene={renderScene}
                    onIndexChange={onIndexChange}
                    initialLayout={{ width: size.width }}
                />
            </View>
        </ScreenContainer>
    );
});
