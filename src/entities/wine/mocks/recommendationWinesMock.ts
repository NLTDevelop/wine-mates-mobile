import { IRecommendationWineList } from '../types/IRecommendationWineList';

export const recommendationWinesMock: IRecommendationWineList = {
    count: 3,
    totalPages: 1,
    rows: [
        {
            id: 1,
            name: 'Château Margaux',
            vintage: 2015,
            producer: 'Château Margaux',
            grapeVariety: 'Cabernet Sauvignon',
            averageUserRating: 4.8,
            countUserRating: 156,
            image: {
                name: '',
                originalName: '',
                mimetype: '',
                size: 0,
                smallUrl: '',
                mediumUrl: '',
                originalUrl: '',
            },
            color: {
                id: 1,
                colorHex: '#8B0000',
                name: 'Deep Red',
            },
            type: {
                id: 1,
                isSparkling: false,
                name: 'Red Wine',
            },
            country: {
                id: 1,
                name: 'France',
            },
            region: {
                id: 1,
                name: 'Bordeaux',
            },
        },
        {
            id: 2,
            name: 'Domaine de la Romanée-Conti',
            vintage: 2018,
            producer: 'Domaine de la Romanée-Conti',
            grapeVariety: 'Pinot Noir',
            averageUserRating: 4.9,
            countUserRating: 203,
            image: {
                name: '',
                originalName: '',
                mimetype: '',
                size: 0,
                smallUrl: '',
                mediumUrl: '',
                originalUrl: '',
            },
            color: {
                id: 1,
                colorHex: '#8B0000',
                name: 'Deep Red',
            },
            type: {
                id: 1,
                isSparkling: false,
                name: 'Red Wine',
            },
            country: {
                id: 1,
                name: 'France',
            },
            region: {
                id: 2,
                name: 'Burgundy',
            },
        },
        {
            id: 3,
            name: 'Sassicaia',
            vintage: 2016,
            producer: 'Tenuta San Guido',
            grapeVariety: 'Cabernet Sauvignon',
            averageUserRating: 4.7,
            countUserRating: 128,
            image: {
                name: '',
                originalName: '',
                mimetype: '',
                size: 0,
                smallUrl: '',
                mediumUrl: '',
                originalUrl: '',
            },
            color: {
                id: 1,
                colorHex: '#8B0000',
                name: 'Deep Red',
            },
            type: {
                id: 1,
                isSparkling: false,
                name: 'Red Wine',
            },
            country: {
                id: 2,
                name: 'Italy',
            },
            region: {
                id: 3,
                name: 'Tuscany',
            },
        },
    ],
};
