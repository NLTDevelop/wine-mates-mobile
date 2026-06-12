import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IHomeSection } from './types/IHomeSection';
import { UpdateHomeSectionsDto } from './dto/UpdateHomeSections.dto';
import { homeSectionsModel } from './HomeSectionsModel';
import { IHomeSectionsListParams } from './params/IHomeSectionsListParams';

class HomeSectionsService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    list = async (params?: IHomeSectionsListParams): Promise<IResponse<IHomeSection[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: this._links.homeSections,
                params,
            });

            if (!response.isError && Array.isArray(response.data)) {
                homeSectionsModel.sections = response.data;
            }

            return response;
        } catch (error) {
            console.warn('HomeSectionsService -> list: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    update = async (
        data: UpdateHomeSectionsDto,
        params?: IHomeSectionsListParams,
    ): Promise<IResponse<IHomeSection[]>> => {
        try {
            const response = await this._requester.request({
                method: 'PATCH',
                url: this._links.homeSections,
                data,
                params,
            });

            if (!response.isError && Array.isArray(response.data)) {
                homeSectionsModel.sections = response.data;
            }

            return response;
        } catch (error) {
            console.warn('HomeSectionsService -> update: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const homeSectionsService = new HomeSectionsService(requester, links);
