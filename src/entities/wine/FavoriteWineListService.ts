import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IFavoriteWineList } from './types/IFavoriteWineList';
import { CreateFavoriteWineListDto } from './dto/CreateFavoriteWineList.dto';
import { UpdateFavoriteWineListDto } from './dto/UpdateFavoriteWineList.dto';
import { favoriteWinesListModel } from './FavoriteWineListsModel';

class FavoriteWineListService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    getAll = async (): Promise<IResponse<IFavoriteWineList[]>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.favoriteWineLists}`,
            });

            if (!response.isError) {
                favoriteWinesListModel.setLists(response.data);
            }

            return response;
        } catch (error) {
            console.warn('FavoriteWineListService -> getAll: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    create = async (data: CreateFavoriteWineListDto): Promise<IResponse<IFavoriteWineList>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.favoriteWineLists}`,
                data,
            });

            if (!response.isError) {
                favoriteWinesListModel.addList(response.data);
            }

            return response;
        } catch (error) {
            console.warn('FavoriteWineListService -> create: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    update = async (id: number, data: UpdateFavoriteWineListDto): Promise<IResponse<IFavoriteWineList>> => {
        try {
            const response = await this._requester.request({
                method: 'PATCH',
                url: `${this._links.favoriteWineLists}/${id}`,
                data,
            });

            if (!response.isError) {
                favoriteWinesListModel.updateList(id, response.data);
            }

            return response;
        } catch (error) {
            console.warn('FavoriteWineListService -> update: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    delete = async (id: number): Promise<IResponse<{}>> => {
        try {
            const response = await this._requester.request({
                method: 'DELETE',
                url: `${this._links.favoriteWineLists}/${id}`,
            });

            if (!response.isError) {
                favoriteWinesListModel.removeList(id);
            }

            return response;
        } catch (error) {
            console.warn('FavoriteWineListService -> delete: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const favoriteWineListService = new FavoriteWineListService(requester, links);
