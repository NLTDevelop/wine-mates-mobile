import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';

import { GenerateSnacksDto } from './dto/GenerateSnacks.dto';
import { ISnack } from './types/ISnack';
import { IWineSnackCuisine } from './types/IWineSnackCuisine';
import { GenerateWineSnacksDto } from './dto/GenerateWineSnacks.dto';

class SnackService {
    constructor(
        private _requester: IRequester,
        private _links: ILinks,
    ) {}

    generateSnacks = async (data: GenerateSnacksDto): Promise<IResponse<{ snacks: ISnack[] }>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.generateSnacks}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('SnackService -> generateSnacks: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    generateWineSnacks = async (data: GenerateWineSnacksDto): Promise<IResponse<{ snacks: ISnack[] }>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.generateWineSnacks}`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('SnackService -> generateWineSnacks: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    getWineSnackCuisines = async (): Promise<IResponse<IWineSnackCuisine[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.wineSnackCuisines}`,
            });

            return response;
        } catch (error) {
            console.warn('SnackService -> getWineSnackCuisines: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const snackService = new SnackService(requester, links);
