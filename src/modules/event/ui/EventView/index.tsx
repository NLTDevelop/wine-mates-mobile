import { useMemo } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { Typography } from '@/UIKit/Typography';
import { EventMap } from '@/modules/event/components/EventMap';
import { WineEventList } from '@/modules/event/components/WineEventList';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { WineEventListItem } from '@/modules/event/components/WineEventList/components/WineEventListItem';

export const EventMapView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        events,
        initialRegion,
        selectedMarkerId,
        handleMarkerPress,
        userLocation,
        isModalVisible,
        handleCloseModal,
        handleFavoritePress
    } = useEventMap();

    const selectedEvent = events.find(event => event.id === selectedMarkerId);

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer edges={[]} scrollEnabled>

            <View style={styles.titleContainer}>
                <Typography text={t('eventMap.wineEvents')} variant="h3" />
            </View>

            <View style={styles.content}>
                <EventMap
                    events={events}
                    initialRegion={initialRegion}
                    selectedMarkerId={selectedMarkerId}
                    onMarkerPress={handleMarkerPress}
                    userLocation={userLocation}
                />

                <WineEventList
                    events={events}
                    selectedEventId={selectedMarkerId}
                    onReadMorePress={handleMarkerPress}
                    onFavoritePress={() => {}}
                />
            </View>

            {selectedEvent && (
                <BottomModal
                    visible={isModalVisible}
                    onClose={handleCloseModal}
                    title={'Event details'}
                >
                    <WineEventListItem
                        event={selectedEvent}
                        isSelected
                        onReadMorePress={handleMarkerPress}
                        onFavoritePress={handleFavoritePress}
                        eventId={selectedEvent.id}
                    />
                </BottomModal>
            )}

        </ScreenContainer>
        // </WithErrorHandler>
    );
});

EventMapView.displayName = 'EventMapView';
