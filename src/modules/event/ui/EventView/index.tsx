import { useMemo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { Typography } from '@/UIKit/Typography';
import { EventMap } from '@/modules/event/components/EventMap';
import { WineEventList } from '@/modules/event/components/WineEventList';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { WineEventListItem } from '@/modules/event/components/WineEventList/components/WineEventListItem';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';

export const EventMapView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
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

    const handleAddEvent = useCallback(() => {
        navigation.navigate('AddEventView');
    }, [navigation]);

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <>
            <ScreenContainer edges={[]} scrollEnabled>

                <View style={styles.titleContainer}>
                    <Typography text={t('eventMap.wineEvents')} variant="h3" />
                </View>

                <View style={styles.content}>
                    <EventMap
                        events={events}
                        initialRegion={initialRegion}
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
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={handleAddEvent}>
                <PlusIcon width={32} height={32} color="white" />
            </TouchableOpacity>
        </>
        // </WithErrorHandler>
    );
});

EventMapView.displayName = 'EventMapView';
