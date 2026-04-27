import { useMemo } from 'react';
import { View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';
import { observer } from 'mobx-react';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { TabsBar } from './components/TabsBar';
import { size } from '@/utils';
import { useEventDetailsView } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsView';
import { EventDetailsTab } from './components/EventDetailsTab';
import { GuestsTab } from './components/GuestsTab';
import { getStyles } from './styles';

interface IRoute {
    key: 'eventDetails' | 'guests';
    title: string;
}

interface ISceneProps {
    route: IRoute;
}

export const EventDetailsView = observer(() => {
    const { t, colors } = useUiContext();
    const route = useRoute<RouteProp<EventStackParamList, 'EventDetailsView'>>();
    const { eventId } = route.params;
    const { screenIndex, routes, onIndexChange } = useEventDetailsView({ t });
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderScene = function renderScene({ route: sceneRoute }: ISceneProps) {
        if (sceneRoute.key === 'eventDetails') {
            return <EventDetailsTab eventId={eventId} />;
        }

        return <GuestsTab />;
    };

    const renderTabBar = function renderTabBar(props: SceneRendererProps & { navigationState: NavigationState<IRoute> }) {
        return <TabsBar tabBarProps={props} onIndexChange={onIndexChange} />;
    };

    return (
        <ScreenContainer
            edges={['top']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('eventDetails.title')} />}
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
