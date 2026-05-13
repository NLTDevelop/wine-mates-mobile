import { useMemo } from 'react';
import { View } from 'react-native';
import { NavigationState, SceneRendererProps, TabView } from 'react-native-tab-view';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { observer } from 'mobx-react';
import { HeaderWithBackButton } from '@/UIKit/HeaderWithBackButton';
import { TabsBar } from './components/TabsBar';
import { size } from '@/utils';
import { useEventDetailsView } from '@/modules/event/ui/EventDetailsView/presenters/useEventDetailsView';
import { EventDetailsTab } from './components/EventDetailsTab';
import { GuestsTab } from './components/EventGuestsTab';
import { getStyles } from './styles';
import { useEventDetails } from './presenters/useEventDetails';

interface IRoute {
    key: 'eventDetails' | 'guests';
    title: string;
}

interface ISceneProps {
    route: IRoute;
}

export const EventDetailsView = observer(() => {
    const { t, colors } = useUiContext();
    const { eventId, screenIndex, routes, onIndexChange, onPressBack } = useEventDetailsView({ t });
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { eventDetail, setEventDetail, isError, isLoading } = useEventDetails(eventId);

    const renderScene = function renderScene({ route: sceneRoute }: ISceneProps) {
        if (sceneRoute.key === 'eventDetails') {
            return (
                <EventDetailsTab
                    eventDetail={eventDetail}
                    setEventDetail={setEventDetail}
                    isError={isError}
                    isLoading={isLoading}
                />
            );
        }

        const requireConfirmation = Boolean(eventDetail?.requiresConfirmation);
        return <GuestsTab eventId={eventId} requiresConfirmation={requireConfirmation} />;
    };

    const renderTabBar = function renderTabBar(
        props: SceneRendererProps & { navigationState: NavigationState<IRoute> },
    ) {
        return <TabsBar tabBarProps={props} onIndexChange={onIndexChange} />;
    };

    return (
        <ScreenContainer
            edges={['top', 'bottom']}
            withGradient
            headerComponent={<HeaderWithBackButton title={t('eventDetails.title')} onPressBack={onPressBack} />}
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
