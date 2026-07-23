import {
    getStateFromPath,
    type LinkingOptions,
    type NavigatorScreenParams,
    type PartialState,
} from '@react-navigation/native';
import { AppState, Linking } from 'react-native';
import { IEventDetailsViewParams } from '@/modules/event/ui/EventDetailsView/types/IEventDetailsViewParams';
import { IPublicProfileRouteParams } from '@/modules/profile/types/IPublicProfileRouteParams';

type TabDeepLinkParamList = {
    EventStack: undefined;
};

export type RootDeepLinkParamList = {
    TabNavigator: NavigatorScreenParams<TabDeepLinkParamList>;
    ProfileDetailsView: undefined;
    WineryProfileDetailsView: undefined;
    PublicUserProfileView: IPublicProfileRouteParams;
    PublicWineryProfileView: IPublicProfileRouteParams;
    EventDetailsView: IEventDetailsViewParams;
    WineDetailsView: {
        wineId: number;
        openedFromDeepLink?: boolean;
        vintages?: 'All';
    };
};

const EVENT_ID_PARAM = 'eventId';
const WINE_ID_PARAM = 'wineId';

export const APP_DEEP_LINK_SCHEME = 'winemates';
export const APP_DEEP_LINK_PREFIX = `${APP_DEEP_LINK_SCHEME}://`;
export const APP_LINK_DOMAIN = 'https://wine-mates.nltdev.pp.ua';

export const createEventDeepLink = (eventId: number) => {
    return `${APP_LINK_DOMAIN}/event/${eventId}`;
};

export const createWineDeepLink = (wineId: number) => {
    return `${APP_LINK_DOMAIN}/wineDetails/${wineId}`;
};

let lastHandledDeepLinkUrl: string | null = null;

const isSupportedDeepLinkUrl = (url: string) => {
    return url.startsWith(APP_LINK_DOMAIN) || url.startsWith(APP_DEEP_LINK_PREFIX);
};

export const linking: LinkingOptions<RootDeepLinkParamList> = {
    prefixes: [APP_LINK_DOMAIN, APP_DEEP_LINK_PREFIX],
    config: {
        screens: {
            TabNavigator: {
                screens: {
                    EventStack: '',
                },
            },
            EventDetailsView: {
                path: `event/:${EVENT_ID_PARAM}`,
                parse: {
                    [EVENT_ID_PARAM]: Number,
                },
            },
            WineDetailsView: {
                path: `wineDetails/:${WINE_ID_PARAM}`,
                parse: {
                    [WINE_ID_PARAM]: Number,
                },
            },
        },
    },
    async getInitialURL() {
        const url = await Linking.getInitialURL();

        if (url && isSupportedDeepLinkUrl(url)) {
            lastHandledDeepLinkUrl = url;
        }

        return url;
    },
    subscribe(listener) {
        const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
            lastHandledDeepLinkUrl = url;
            listener(url);
        });

        const appStateSubscription = AppState.addEventListener('change', async (state) => {
            if (state !== 'active') {
                return;
            }

            const url = await Linking.getInitialURL();
            if (!url || !isSupportedDeepLinkUrl(url) || url === lastHandledDeepLinkUrl) {
                return;
            }

            lastHandledDeepLinkUrl = url;
            listener(url);
        });

        return () => {
            linkingSubscription.remove();
            appStateSubscription.remove();
        };
    },
    getStateFromPath: (path, options) => {
        const state = getStateFromPath(path, options) as PartialState<any> | undefined;
        const route = state?.routes?.find((item) => item.name === 'EventDetailsView' || item.name === 'WineDetailsView') as
            | { name?: string; params?: Record<string, unknown> }
            | undefined;

        if (route) {
            route.params = {
                ...(route.params || {}),
                openedFromDeepLink: true,
                ...(route.name === 'WineDetailsView' ? { vintages: 'All' } : {}),
            };
        }

        return state;
    },
};
