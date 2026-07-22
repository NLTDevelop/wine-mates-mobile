import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { eventsService } from '@/entities/events/EventsService';
import { userEventsModel } from '@/entities/events/UserEventsModel';
import { localization } from '@/UIProvider/localization/Localization';
import { toastService } from '@/libs/toast/toastService';

const LIMIT = 10;

export const usePublicProfileEvents = (userId: number) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const list = userEventsModel.list;
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadEvents = useCallback(
        async (offset: number) => {
            if (!userId) {
                setIsLoading(false);
                return;
            }

            try {
                if (offset === 0) {
                    setIsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }

                const response = await eventsService.getUserEvents({ userId, limit: LIMIT, offset });

                if (response.isError || !response.data) {
                    toastService.showError(
                        localization.t('common.errorHappened'),
                        response.message || localization.t('common.somethingWentWrong'),
                    );
                }
            } catch (error) {
                console.warn('usePublicProfileEvents -> loadEvents: ', error);
                toastService.showError(
                    localization.t('common.errorHappened'),
                    localization.t('common.somethingWentWrong'),
                );
            } finally {
                setIsLoading(false);
                setIsLoadingMore(false);
            }
        },
        [userId],
    );

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            loadEvents(0);
        });

        return () => {
            cancelAnimationFrame(frameId);
            userEventsModel.list = null;
        };
    }, [loadEvents]);

    const onRefreshEvents = useCallback(async () => {
        await loadEvents(0);
    }, [loadEvents]);

    const onLoadMoreEvents = useCallback(async () => {
        const currentList = userEventsModel.list;

        if (!currentList || isLoading || isLoadingMore || currentList.rows.length >= currentList.count) {
            return;
        }

        await loadEvents(currentList.rows.length);
    }, [isLoading, isLoadingMore, loadEvents]);

    const onEventPress = useCallback(
        (eventId: number) => {
            navigation.navigate('EventDetailsView', { eventId });
        },
        [navigation],
    );

    const onFavoriteEventPress = useCallback(async (eventId: number) => {
        const currentList = userEventsModel.list;
        const event = currentList?.rows.find(item => item.id === eventId);

        if (!currentList || !event) {
            return;
        }

        const response = event.isSaved
            ? await eventsService.removeFromFavorite(eventId)
            : await eventsService.addToFavorite(eventId);

        if (response.isError) {
            toastService.showError(
                localization.t('common.errorHappened'),
                response.message || localization.t('common.somethingWentWrong'),
            );
            return;
        }

        userEventsModel.list = {
            ...currentList,
            rows: currentList.rows.map(item => (item.id === eventId ? { ...item, isSaved: !event.isSaved } : item)),
        };
    }, []);

    return {
        events: list?.rows || [],
        isEventsLoading: isLoading,
        isEventsLoadingMore: isLoadingMore,
        onRefreshEvents,
        onLoadMoreEvents,
        onEventPress,
        onFavoriteEventPress,
    };
};
