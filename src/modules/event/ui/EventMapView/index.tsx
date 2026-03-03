import { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { ScreenHeader } from '@/UIKit/ScreenHeader';
import { Typography } from '@/UIKit/Typography';
import { EventMap } from '@/modules/event/components/EventMap';
import { WineEventList } from '@/modules/event/components/WineEventList';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { ScreenContainer } from '@/UIKit/ScreenContainer';

export const EventMapView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { events, initialRegion, selectedMarkerId, handleMarkerPress } = useEventMap();

    return (
        // <WithErrorHandler error={isAuthError ? ErrorTypeEnum.ERROR : null} onRetry={retrySignIn}>
        <ScreenContainer edges={['top']} scrollEnabled headerComponent={<ScreenHeader />}>

            <View style={styles.titleContainer}>
                <Typography text={t('eventMap.wineEvents')} variant="h3" />
            </View>

            <View style={styles.content}>
                <EventMap
                    events={events}
                    initialRegion={initialRegion}
                    selectedMarkerId={selectedMarkerId}
                    onMarkerPress={handleMarkerPress}
                />

                <WineEventList
                    events={events}
                    selectedEventId={selectedMarkerId}
                    onReadMorePress={handleMarkerPress}
                    onFavoritePress={() => {}}
                />
            </View>

        </ScreenContainer>
        // </WithErrorHandler>
    );
});

EventMapView.displayName = 'EventMapView';
