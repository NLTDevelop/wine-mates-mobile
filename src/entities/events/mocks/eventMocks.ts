import { IEvent, IEventDetail } from '../types/IEvent';
import { Currency } from '../enums/Currency';
import { EventType } from '../enums/EventType';
import { TastingType } from '../enums/TastingType';
import { ParticipationCondition } from '../enums/ParticipationCondition';

export const MOCK_EVENTS: IEvent[] = [
    {
        id: 1,
        theme: 'Natural Wines & Pet-Nats',
        description: 'Join us for an evening of fine wine and great company.',
        eventDate: '2026-08-14',
        eventTime: '14:30:00',
        price: 3200,
        priceUsd: 78,
        currency: Currency.UAH,
        latitude: 50.4501,
        longitude: 30.5234,
        distanceKm: '4',
        eventType: EventType.Tastings,
        tastingType: TastingType.Regular,
        participationCondition: ParticipationCondition.FixedPrice,
    },
    {
        id: 2,
        theme: 'Wine & Cheese Pairing',
        description: 'Discover the art of pairing wine with cheese.',
        eventDate: '2026-08-15',
        eventTime: '18:00:00',
        price: 2500,
        priceUsd: 61,
        currency: Currency.UAH,
        latitude: 50.4601,
        longitude: 30.5334,
        distanceKm: '2',
        eventType: EventType.Parties,
        tastingType: TastingType.Blind,
        participationCondition: ParticipationCondition.SplitBill,
    },
    {
        id: 3,
        theme: 'Virtual Wine Masterclass',
        description: 'Masterclass covering wine tasting techniques.',
        eventDate: '2026-08-16',
        eventTime: '15:00:00',
        price: 1800,
        priceUsd: 44,
        currency: Currency.UAH,
        latitude: 50.4401,
        longitude: 30.5134,
        distanceKm: '6',
        eventType: EventType.Tastings,
        tastingType: TastingType.Regular,
        participationCondition: ParticipationCondition.Charity,
    },
];

export const MOCK_EVENT_DETAILS: IEventDetail[] = [
    {
        id: 1,
        latitude: 50.4501,
        longitude: 30.5234,
        description: 'Join us for an exciting exploration of natural wines and pet-nats.',
        eventDate: '2026-08-14',
        eventTime: '14:30:00',
        price: 3200,
        eventType: EventType.Tastings,
        theme: 'Natural Wine & Pet-Nats',
        restaurant: 'Catch',
        location: 'Ukraine, Kyiv Reg., Irpin',
        speaker: 'Ihor Pototsiankin',
        distance: '4 km from you',
        language: 'UA',
        seats: 24,
        currency: Currency.UAH,
        tastingType: TastingType.Regular,
        participationCondition: ParticipationCondition.FixedPrice,
        wineSet: [
            {
                id: 1,
                wineId: 101,
                sortOrder: 1,
                wine: {
                    id: 101,
                    name: 'Cabernet Sauvignon',
                    producer: 'My Wine',
                    vintage: 2021,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-101/80/80',
                    },
                },
            },
            {
                id: 2,
                wineId: 102,
                sortOrder: 2,
                wine: {
                    id: 102,
                    name: 'Merlot',
                    producer: 'Duckhorn Vineyards',
                    vintage: 2019,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-102/80/80',
                    },
                },
            },
            {
                id: 3,
                wineId: 103,
                sortOrder: 3,
                wine: {
                    id: 103,
                    name: 'Pinot Noir',
                    producer: 'Cloudy Bay',
                    vintage: 2020,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-103/80/80',
                    },
                },
            },
            {
                id: 4,
                wineId: 104,
                sortOrder: 4,
                wine: {
                    id: 104,
                    name: 'Chardonnay',
                    producer: 'Beringer',
                    vintage: 2022,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-104/80/80',
                    },
                },
            },
        ],
    },
    {
        id: 2,
        latitude: 50.4601,
        longitude: 30.5334,
        description: 'Discover the art of pairing wine with cheese.',
        eventDate: '2026-08-15',
        eventTime: '18:00:00',
        price: 2500,
        eventType: EventType.Parties,
        theme: 'Wine & Cheese Pairing',
        restaurant: 'Wine House',
        location: 'Ukraine, Kyiv, Podil',
        speaker: 'Maria Kovalenko',
        distance: '2 km from you',
        language: 'UA',
        seats: 20,
        currency: Currency.UAH,
        tastingType: TastingType.Blind,
        participationCondition: ParticipationCondition.SplitBill,
        wineSet: [
            {
                id: 5,
                wineId: 105,
                sortOrder: 1,
                wine: {
                    id: 105,
                    name: 'Sauvignon Blanc',
                    producer: 'Bisol',
                    vintage: 2021,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-105/80/80',
                    },
                },
            },
            {
                id: 6,
                wineId: 106,
                sortOrder: 2,
                wine: {
                    id: 106,
                    name: 'Riesling',
                    producer: 'Dr. Loosen',
                    vintage: 2020,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-106/80/80',
                    },
                },
            },
            {
                id: 7,
                wineId: 107,
                sortOrder: 3,
                wine: {
                    id: 107,
                    name: 'Syrah',
                    producer: 'Penfolds',
                    vintage: 2018,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-107/80/80',
                    },
                },
            },
        ],
    },
    {
        id: 3,
        latitude: 50.4401,
        longitude: 30.5134,
        description: 'Online masterclass covering wine tasting techniques.',
        eventDate: '2026-08-16',
        eventTime: '15:00:00',
        price: 1800,
        eventType: EventType.Tastings,
        theme: 'Wine Tasting Fundamentals',
        restaurant: 'Online Event',
        location: 'Online',
        speaker: 'Anton Shevchenko',
        distance: 'Online',
        language: 'EN',
        seats: 50,
        currency: Currency.UAH,
        tastingType: TastingType.Regular,
        participationCondition: ParticipationCondition.Guest,
        wineSet: [
            {
                id: 8,
                wineId: 108,
                sortOrder: 1,
                wine: {
                    id: 108,
                    name: 'Tempranillo',
                    producer: 'Rioja Alta',
                    vintage: 2019,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-108/80/80',
                    },
                },
            },
            {
                id: 9,
                wineId: 109,
                sortOrder: 2,
                wine: {
                    id: 109,
                    name: 'Sangiovese',
                    producer: 'Antinori',
                    vintage: 2018,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-109/80/80',
                    },
                },
            },
            {
                id: 10,
                wineId: 110,
                sortOrder: 3,
                wine: {
                    id: 110,
                    name: 'Grenache',
                    producer: 'Chapoutier',
                    vintage: 2020,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-110/80/80',
                    },
                },
            },
            {
                id: 11,
                wineId: 111,
                sortOrder: 4,
                wine: {
                    id: 111,
                    name: 'Malbec',
                    producer: 'Catena Zapata',
                    vintage: 2021,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-111/80/80',
                    },
                },
            },
            {
                id: 12,
                wineId: 112,
                sortOrder: 5,
                wine: {
                    id: 112,
                    name: 'Zinfandel',
                    producer: 'Ridge',
                    vintage: 2017,
                    image: {
                        smallUrl: 'https://picsum.photos/seed/wine-112/80/80',
                    },
                },
            },
        ],
    },
];

export const getEventDetailById = (id: number): IEventDetail | undefined => {
    return MOCK_EVENT_DETAILS.find(event => event.id === id);
};
