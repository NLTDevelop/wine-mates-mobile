import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IWineMarketplaceSummary } from '../types/IWineMarketplaceSummary';

class WineMarketplaceService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    getPurchasePartners = async (wineId: number): Promise<IResponse<IWineMarketplaceSummary>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: this._links.partners,
                params: { wineId },
            });
        } catch (error) {
            console.warn('WineMarketplaceService -> getPurchasePartners: ', error);
            return { isError: true, message: '' };
        }
    };
}

export const wineMarketplaceService = new WineMarketplaceService(requester, links);
