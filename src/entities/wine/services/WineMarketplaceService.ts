import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IWineMarketplaceSummary } from '../types/IWineMarketplaceSummary';
import { IWineMarketplaceParams } from '../params/IWineMarketplaceParams';

class WineMarketplaceService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    getPurchasePartners = async (params: IWineMarketplaceParams): Promise<IResponse<IWineMarketplaceSummary>> => {
        try {
            return await this._requester.request({
                method: 'GET',
                url: this._links.partners,
                params,
            });
        } catch (error) {
            console.warn('WineMarketplaceService -> getPurchasePartners: ', error);
            return { isError: true, message: '' };
        }
    };
}

export const wineMarketplaceService = new WineMarketplaceService(requester, links);
