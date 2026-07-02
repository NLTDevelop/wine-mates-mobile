import { useCallback, useEffect, useMemo, useRef } from 'react';
import { CommonActions, RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BackHandler } from 'react-native';
import { ILocalization } from '@/UIProvider/localization/ILocalization';
import { IEventDetailsViewParams } from '../types/IEventDetailsViewParams';

interface IRoute {
    key: 'eventDetails' | 'guests';
    title: string;
}

interface IProps {
    t: ILocalization['t'];
}

interface IEventDetailsRouteParams {
    [key: string]: object | undefined;
    EventDetailsView: IEventDetailsViewParams;
}

type Navigation = NativeStackNavigationProp<IEventDetailsRouteParams, 'EventDetailsView'>;

const getInitialScreenIndex = (initialTab?: IEventDetailsViewParams['initialTab']) => {
    if (initialTab === 'guests') {
        return 1;
    }

    return 0;
};

export const useEventDetailsView = ({ t }: IProps) => {
    const navigation = useNavigation<Navigation>();
    const route = useRoute<RouteProp<IEventDetailsRouteParams, 'EventDetailsView'>>();
    const isResettingRef = useRef(false);
    const { eventId, openedFromDeepLink, initialTab } = route.params;

    const routes: IRoute[] = useMemo(() => {
        return [
            { key: 'eventDetails', title: t('eventDetails.eventDetailsTab') },
            { key: 'guests', title: t('eventDetails.guestsTab') },
        ];
    }, [t]);

    const screenIndex = getInitialScreenIndex(initialTab);

    const onIndexChange = useCallback((index: number) => {
        navigation.setParams({
            initialTab: routes[index]?.key || 'eventDetails',
        });
    }, [navigation, routes]);

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
        if (openedFromDeepLink || !navigation.canGoBack()) {
            resetToHome();
            return;
        }

        navigation.goBack();
    }, [navigation, openedFromDeepLink, resetToHome]);

    useEffect(() => {
        if (!openedFromDeepLink && navigation.canGoBack()) {
            return undefined;
        }

        return navigation.addListener('beforeRemove', (event) => {
            if (isResettingRef.current) {
                return;
            }

            if (!openedFromDeepLink && navigation.canGoBack()) {
                return;
            }

            event.preventDefault();
            resetToHome();
        });
    }, [navigation, openedFromDeepLink, resetToHome]);

    useFocusEffect(
        useCallback(() => {
            if (!openedFromDeepLink && navigation.canGoBack()) {
                return undefined;
            }

            const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
                resetToHome();

                return true;
            });

            return () => {
                subscription.remove();
            };
        }, [navigation, openedFromDeepLink, resetToHome]),
    );

    return {
        eventId,
        screenIndex,
        routes,
        onIndexChange,
        onPressBack,
    };
};
