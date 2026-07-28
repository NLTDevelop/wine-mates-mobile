import { IResponse } from '@/libs/requester';
import { PartnerStatus } from '../enums/PartnerStatus';
import { IWinePrivateOffer, IWinePrivateOffersParams } from '../types/IWinePrivateOffer';
import { IWinePurchasePartner } from '../types/IWinePurchasePartner';

const createMedia = (id: number, url: string) => ({
    id,
    name: `marketplace-${id}`,
    originalName: `marketplace-${id}.jpg`,
    mimetype: 'image/jpeg',
    size: 0,
    smallUrl: url,
    mediumUrl: url,
    originalUrl: url,
});

const purchasePartners: IWinePurchasePartner[] = [
    {
        id: 1,
        name: 'Carpathian Family Winery',
        description: 'A family-owned winery combining tradition with modern winemaking.',
        website: 'https://example.com/winery',
        status: PartnerStatus.WINERY,
        logo: createMedia(11, 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=240'),
        image: createMedia(12, 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200'),
    },
    {
        id: 2,
        name: 'Silpo Wine',
        description: 'Partnership that develops business.',
        website: 'https://silpo.ua',
        status: PartnerStatus.STORE,
        logo: createMedia(21, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=320'),
        image: createMedia(22, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200'),
        minPrice: 450,
        currency: 'UAH',
    },
    {
        id: 3,
        name: 'Private offers',
        description: 'Offers from WineMates business partners.',
        website: null,
        status: PartnerStatus.BUSINESS_PARTNERS,
        logo: null,
        image: createMedia(32, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200'),
        minPrice: 570,
        maxPrice: 850,
        currency: 'UAH',
    },
];

const privateOffers: IWinePrivateOffer[] = [450, 550, 570, 587, 240, 900, 587, 620, 700, 320, 780, 490].map(
    (price, index) => ({
        id: index + 1,
        wineId: 1,
        price,
        currency: 'UAH',
        seller: {
            id: index + 101,
            firstName: index % 2 === 0 ? 'Yelyzaveta' : 'Artem',
            lastName: index % 2 === 0 ? 'Chumakova' : 'Pilipenko',
            avatar: createMedia(
                index + 100,
                index % 2 === 0
                    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160'
                    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
            ),
        },
    }),
);

class WineMarketplaceService {
    getPurchasePartners = async (_wineId: number): Promise<IResponse<IWinePurchasePartner[]>> => {
        return {
            isError: false,
            data: purchasePartners,
            message: '',
        };
    };

    getPrivateOffers = async (
        wineId: number,
        params: IWinePrivateOffersParams = {},
    ): Promise<IResponse<IWinePrivateOffer[]>> => {
        const rows = privateOffers
            .map(offer => ({ ...offer, wineId }))
            .filter(offer => params.minPrice === undefined || offer.price >= params.minPrice)
            .filter(offer => params.maxPrice === undefined || offer.price <= params.maxPrice);

        return {
            isError: false,
            data: rows,
            message: '',
        };
    };
}

export const wineMarketplaceService = new WineMarketplaceService();
