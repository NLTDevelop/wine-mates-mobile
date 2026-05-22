import { useCallback, useEffect, useRef, useState } from 'react';
import { CommonActions, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ILocalization } from '@/UIProvider/localization/ILocalization';

interface IRoute {
    key: 'eventDetails' | 'guests';
    title: string;
}

interface IProps {
    t: ILocalization['t'];
}

interface IEventDetailsRouteParams {
    [key: string]: object | undefined;
    EventDetailsView: {
        eventId: number;
        openedFromDeepLink?: boolean;
    };
}

export const useEventDetailsView = ({ t }: IProps) => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<IEventDetailsRouteParams, 'EventDetailsView'>>();
    const [screenIndex, setScreenIndex] = useState(0);
    const isResettingRef = useRef(false);
    const { eventId, openedFromDeepLink } = route.params;

    const routes: IRoute[] = [
        { key: 'eventDetails', title: t('eventDetails.eventDetailsTab') },
        { key: 'guests', title: t('eventDetails.guestsTab') },
    ];

    const onIndexChange = useCallback((index: number) => {
        setScreenIndex(index);
    }, []);

    const resetToHome = useCallback(() => {
        isResettingRef.current = true;
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: 'TabNavigator',
                        state: {
                            index: 0,
                            routes: [
                                {
                                    name: 'HomeStack',
                                    state: {
                                        index: 0,
                                        routes: [{ name: 'HomeView' }],
                                    },
                                },
                            ],
                        },
                    },
                ],
            }),
        );
    }, [navigation]);

    const onPressBack = useCallback(() => {
        if (openedFromDeepLink && !navigation.canGoBack()) {
            resetToHome();
            return;
        }

        navigation.goBack();
    }, [navigation, openedFromDeepLink, resetToHome]);

    useEffect(() => {
        if (!openedFromDeepLink) {
            return undefined;
        }

        return navigation.addListener('beforeRemove', (event) => {
            if (isResettingRef.current) {
                return;
            }

            if (navigation.canGoBack()) {
                return;
            }

            event.preventDefault();
            resetToHome();
        });
    }, [navigation, openedFromDeepLink, resetToHome]);

    return {
        eventId,
        screenIndex,
        routes,
        onIndexChange,
        onPressBack,
    };
};
