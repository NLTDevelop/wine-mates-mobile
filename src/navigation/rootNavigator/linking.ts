import type { LinkingOptions, NavigatorScreenParams } from '@react-navigation/native';

type EventDeepLinkStackParamList = {
    EventDetailsView: {
        eventId: number;
    };
};

type TabDeepLinkParamList = {
    EventStack: NavigatorScreenParams<EventDeepLinkStackParamList>;
};

export type RootDeepLinkParamList = {
    TabNavigator: NavigatorScreenParams<TabDeepLinkParamList>;
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
                    EventStack: {
                        screens: {
                            EventDetailsView: {
                                path: `event/:${EVENT_ID_PARAM}`,
                                parse: {
                                    [EVENT_ID_PARAM]: Number,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
