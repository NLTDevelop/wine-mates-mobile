import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { EventMap } from '@/modules/event/components/EventMap';
import { WineEventList } from '@/modules/event/components/WineEventList';
import { EventModalCard } from '@/modules/event/components/EventModalCard';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { useEventsList } from '@/modules/event/presenters/useEventsList';
import { useEventMapView } from '@/modules/event/presenters/useEventMapView';
import { getStyles } from './styles';

export const EventMapView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    
    const {
        initialRegion,
        userLocation,
    } = useEventMap();

    const {
        events,
        loadEvents,
    } = useEventsList();

    const {
        mapPins,
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCloseModal,
        onBookingPress,
        onModalFavoritePress,
        onReadMorePress,
        onFavoritePress,
    } = useEventMapView({ events, loadEvents });

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <>
            <ScreenContainer edges={[]} scrollEnabled>

                <View style={styles.titleContainer}>
                    <Typography text={t('eventMap.wineEvents')} variant="h3" />
                </View>

                <View style={styles.content}>
                    <EventMap
                        mapPins={mapPins}
                        initialRegion={initialRegion}
                        onMarkerPress={onMarkerPress}
                        userLocation={userLocation}
                    />
                </View>

                <WineEventList
                    events={events}
                    selectedEventId={null}
                    onReadMorePress={onReadMorePress}
                    onFavoritePress={onFavoritePress}
                />

            </ScreenContainer>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={onAddEvent}>
                <PlusIcon width={32} height={32} color="white" />
            </TouchableOpacity>

            {selectedEvent && (
                <BottomModal
                    visible={isModalVisible}
                    onClose={onCloseModal}
                >
                    <EventModalCard
                        event={selectedEvent}
                        onBookingPress={onBookingPress}
                        onFavoritePress={onModalFavoritePress}
                    />
                </BottomModal>
            )}
        </>
        // </WithErrorHandler>
    );
});

EventMapView.displayName = 'EventMapView';
