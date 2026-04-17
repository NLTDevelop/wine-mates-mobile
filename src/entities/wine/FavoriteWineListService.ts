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
                favoriteWinesListModel.lists = response.data;
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

            if (!response.isError && response.data && response.data.id) {
                const currentLists = favoriteWinesListModel.lists || [];
                favoriteWinesListModel.lists = [...currentLists, response.data];
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
                const currentLists = favoriteWinesListModel.lists;
                if (currentLists) {
                    favoriteWinesListModel.lists = currentLists.map(list => 
                        list.id === id ? response.data : list
                    );
                }
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
                const currentLists = favoriteWinesListModel.lists;
                if (currentLists) {
                    favoriteWinesListModel.lists = currentLists.filter(list => list.id !== id);
                }
                if (favoriteWinesListModel.currentListId === id) {
                    favoriteWinesListModel.currentListId = null;
                    favoriteWinesListModel.currentListWines = null;
                }
            }

            return response;
        } catch (error) {
            console.warn('FavoriteWineListService -> delete: ', error);
            return { isError: true, data: null, message: '' } as any;
        }
    };
}

export const favoriteWineListService = new FavoriteWineListService(requester, links);
