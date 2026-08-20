import { useMemo } from 'react';
import { ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { EventMap } from '@/modules/event/ui/EventMapView/components/EventMap';
import { WineEventList } from '@/modules/event/ui/EventMapView/components/WineEventList';
import { EventMapHeader } from '@/modules/event/ui/EventMapView/components/EventMapHeader';
import { useEventMapScreen } from './presenters/useEventMapScreen';
import { getStyles } from './styles';
import { ScreenHeader } from '@/UIKit/ScreenHeader';
import { PermissionGuardModal } from '@/UIKit/PermissionGuardModal';

export const EventMapView = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const {
        isRefetching,
        mapPins,
        initialRegion,
        userLocation,
        selectedTab,
        onTabChange,
        onFilterPress,
        filterCount,
        filteredEvents,
        isLocationLoading,
        onAddEvent,
        onMarkerPress,
        onCardPress,
        onReadMorePress,
        onEditPress,
        onFavoritePress,
        onUpdateEvent,
        onMapPress,
        searchLocation,
        permissionModalProps,
    } = useEventMapScreen();

    return (
        <ScreenContainer edges={['top']} scrollEnabled headerComponent={<ScreenHeader />} withGradient>
            <EventMapHeader
                selectedTab={selectedTab}
                onTabChange={onTabChange}
                onFilterPress={onFilterPress}
                onAddEventPress={onUpdateEvent}
                isUpdateEventDisabled={isRefetching}
                filterCount={filterCount}
            />
            {isLocationLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <>
                    <View style={styles.content}>
                        <View style={styles.mapContainer}>
                            <EventMap
                                mapPins={mapPins}
                                selectedTab={selectedTab}
                                initialRegion={initialRegion}
                                onMarkerPress={onMarkerPress}
                                onMapPress={onMapPress}
                                userLocation={userLocation}
                                searchLocation={searchLocation}
                            />
                            <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={onAddEvent}>
                                <PlusIcon width={32} height={32} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <WineEventList
                        events={filteredEvents}
                        onReadMorePress={onReadMorePress}
                        onFavoritePress={onFavoritePress}
                        onEditPress={onEditPress}
                        onCardPress={onCardPress}
                    />
                </>
            )}
            <PermissionGuardModal {...permissionModalProps} />
        </ScreenContainer>
    );
});

EventMapView.displayName = 'EventMapView';
