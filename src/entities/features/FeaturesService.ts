import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { featuresModel } from './FeaturesModel';
import { IFeatures } from './types/IFeature';

class FeaturesService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    list = async (): Promise<IResponse<IFeatures[]>> => {
        try {
            const response = await this._requester.request({
                method: 'get',
                url: this._links.features,
            });
            if (!response.isError) {
                featuresModel.features = response.data;
            }
            return response;
        } catch (error) {
            console.warn('FeaturesService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const featuresService = new FeaturesService(requester, links);
