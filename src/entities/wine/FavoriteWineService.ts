import { IRequester, IResponse, requester } from '@/libs/requester';
import { ILinks, links } from '@/Links';
import { IList } from '../IList';
import { IWineListItem } from './types/IWineListItem';
import { AddWineToFavoriteListDto } from './dto/AddWineToFavoriteList.dto';
import { IFavoriteWineListParams } from './params/IFavoriteWineListParams';
import { favoriteWinesListModel } from './FavoriteWineListsModel';

class FavoriteWineService {
    constructor(private _requester: IRequester, private _links: ILinks) {}

    getWinesByListId = async (
        listId: number,
        params: IFavoriteWineListParams,
    ): Promise<IResponse<IList<IWineListItem>>> => {
        try {
            const response = await this._requester.request({
                method: 'GET',
                url: `${this._links.favoriteWineLists}/${listId}/wines`,
                params,
            });

            if (!response.isError) {
                if (params.offset === 0) {
                    favoriteWinesListModel.currentListWines = response.data;
                } else {
                    favoriteWinesListModel.append(response.data);
                }
            }

            return response;
        } catch (error) {
            console.warn('FavoriteWineService -> getWinesByListId: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    addWineToList = async (
        listId: number,
        data: AddWineToFavoriteListDto,
    ): Promise<IResponse<{ message: string }>> => {
        try {
            const response = await this._requester.request({
                method: 'POST',
                url: `${this._links.favoriteWineLists}/${listId}/wines`,
                data,
            });

            return response;
        } catch (error) {
            console.warn('FavoriteWineService -> addWineToList: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };

    removeWineFromList = async (listId: number, wineId: number): Promise<IResponse<{}>> => {
        try {
            const response = await this._requester.request({
                method: 'DELETE',
                url: `${this._links.favoriteWineLists}/${listId}/wines/${wineId}`,
            });

            if (!response.isError) {
                const currentWines = favoriteWinesListModel.currentListWines;
                if (currentWines) {
                    favoriteWinesListModel.currentListWines = {
                        ...currentWines,
                        count: currentWines.count - 1,
                        rows: currentWines.rows.filter(wine => wine.id !== wineId),
                    };
                }
            }

            return response;
        } catch (error) {
            console.warn('FavoriteWineService -> removeWineFromList: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const favoriteWineService = new FavoriteWineService(requester, links);
