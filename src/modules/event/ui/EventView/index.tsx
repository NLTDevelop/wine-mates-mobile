import { useMemo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { Typography } from '@/UIKit/Typography';
import { EventMap } from '@/modules/event/components/EventMap';
import { useEventMap } from '@/modules/event/presenters/useEventMap';
import { ScreenContainer } from '@/UIKit/ScreenContainer';
import { PlusIcon } from '@assets/icons/PlusIcon';
import { EventStackParamList } from '@/navigation/eventStackNavigator/types';

export const EventMapView = observer(() => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const navigation = useNavigation<NativeStackNavigationProp<EventStackParamList>>();
    const {
        mapPins,
        initialRegion,
        onMarkerPress,
        userLocation,
    } = useEventMap();

    const onAddEvent = useCallback(() => {
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
                        mapPins={mapPins}
                        initialRegion={initialRegion}
                        onMarkerPress={onMarkerPress}
                        userLocation={userLocation}
                    />
                </View>

            </ScreenContainer>
            <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={onAddEvent}>
                <PlusIcon width={32} height={32} color="white" />
            </TouchableOpacity>
        </>
        // </WithErrorHandler>
    );
});

EventMapView.displayName = 'EventMapView';
