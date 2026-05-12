import {
    getStateFromPath,
    type LinkingOptions,
    type NavigatorScreenParams,
    type PartialState,
} from '@react-navigation/native';

type TabDeepLinkParamList = {
    EventStack: undefined;
};

export type RootDeepLinkParamList = {
    TabNavigator: NavigatorScreenParams<TabDeepLinkParamList>;
    EventDetailsView: {
        eventId: number;
        openedFromDeepLink?: boolean;
    };
};

const EVENT_ID_PARAM = 'eventId';

export const APP_DEEP_LINK_SCHEME = 'winemates';
export const APP_DEEP_LINK_PREFIX = `${APP_DEEP_LINK_SCHEME}://`;
export const APP_LINK_DOMAIN = 'https://wine-mates.nltdev.pp.ua';

export const createEventDeepLink = (eventId: number) => {
    return `${APP_LINK_DOMAIN}/event/${eventId}`;
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
        },
    },
    getStateFromPath: (path, options) => {
        const state = getStateFromPath(path, options) as PartialState<any> | undefined;
        const route = state?.routes?.find((item) => item.name === 'EventDetailsView');

        if (route) {
            route.params = {
                ...(route.params || {}),
                openedFromDeepLink: true,
            };
        }

        return state;
    },
};
