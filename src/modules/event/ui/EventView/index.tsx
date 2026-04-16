import { useMemo } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { EventMap } from '@/modules/event/components/EventMap';
import { WineEventList } from '@/modules/event/components/WineEventList';
import { EventModalCard } from '@/modules/event/components/EventModalCard';
import { EventMapHeader } from '@/modules/event/ui/components/EventMapHeader/ui';
import { EventFiltersModal } from '@/modules/event/ui/components/EventFiltersModal/ui';
import { useEventMapScreen } from './presenters/useEventMapScreen';
import { getStyles } from './styles';

export const EventMapView = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        isRefetching,
        mapPins,
        initialRegion,
        mapRegionKey,
        userLocation,
        selectedTab,
        onTabChange,
        onFilterPress,
        isFilterModalVisible,
        onCloseFilterModal,
        filterCount,
        filteredEvents,
        selectedEvent,
        isModalVisible,
        onAddEvent,
        onMarkerPress,
        onCloseModal,
        onBookingPress,
        onModalFavoritePress,
        onReadMorePress,
        onFavoritePress,
        onUpdateEvent,
    } = useEventMapScreen();

    return (
        <>
            <ScreenContainer edges={[]} scrollEnabled>
                <EventMapHeader
                    selectedTab={selectedTab}
                    onTabChange={onTabChange}
                    onFilterPress={onFilterPress}
                    onAddEventPress={onUpdateEvent}
                    filterCount={filterCount}
                />

                {isRefetching && (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                )}

                <View style={styles.content}>
                    <EventMap
                        mapPins={mapPins}
                        initialRegion={initialRegion}
                        mapRegionKey={mapRegionKey}
                        onMarkerPress={onMarkerPress}
                        userLocation={userLocation}
                    />
                </View>

                <WineEventList
                    events={filteredEvents}
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

            <EventFiltersModal
                visible={isFilterModalVisible}
                onClose={onCloseFilterModal}
            />
        </>
    );
});

EventMapView.displayName = 'EventMapView';
