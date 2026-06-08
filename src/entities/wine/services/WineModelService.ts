import { favoriteWinesListModel } from '../models/FavoriteWineListsModel';
import { wineAndStylesModel } from '../models/WineAndStylesModel';
import { wineListModel } from '../models/WineListModel';
import { wineListsModel, ISelectedFilters } from '../models/WineListsModel';
import { wineModel } from '../models/WineModel';
import { wineReviewsListModel } from '../models/WineReviewsListModel';
import { IWineListItem } from '../types/IWineListItem';

export const getRecommendationKey = (typeId: number, colorId: number) => `${typeId}_${colorId}`;

export const setRecommendations = (key: string, rows: IWineListItem[], page: number, totalPages: number) => {
    wineAndStylesModel.recommendations = {
        ...wineAndStylesModel.recommendations,
        [key]: rows,
    };

    wineAndStylesModel.recommendationsPagination = {
        ...wineAndStylesModel.recommendationsPagination,
        [key]: { page, totalPages },
    };
};

export const appendRecommendations = (key: string, rows: IWineListItem[], page: number) => {
    const currentPagination = wineAndStylesModel.recommendationsPagination[key];

    wineAndStylesModel.recommendations = {
        ...wineAndStylesModel.recommendations,
        [key]: [...(wineAndStylesModel.recommendations[key] ?? []), ...rows],
    };

    if (currentPagination) {
        wineAndStylesModel.recommendationsPagination = {
            ...wineAndStylesModel.recommendationsPagination,
            [key]: { ...currentPagination, page },
        };
    }
};

export const clearFavoriteWinesListModel = () => {
    favoriteWinesListModel.lists = null;
    favoriteWinesListModel.currentListId = null;
    favoriteWinesListModel.currentListWines = null;
};

export const clearWineListsModel = () => {
    wineListsModel.list = null;
};

export const clearWineListModel = () => {
    wineListModel.list = null;
};

export const getEmptyWineFilters = (): ISelectedFilters => ({
    sort: [],
    colors: [],
    types: [],
});

export const clearWineListsFilters = () => {
    wineListsModel.filters = getEmptyWineFilters();
};

export const clearWineReviewsListModel = () => {
    wineReviewsListModel.list = null;
};

export const clearWineModel = () => {
    wineModel.wine = null;
    wineModel.selectedWineId = null;
    wineModel.vintages = null;
    wineModel.customVintage = null;
    wineModel.image = null;
    wineModel.base = null;
    wineModel.look = null;
    wineModel.colors = null;
    wineModel.colorsShades = null;
    wineModel.smells = null;
    wineModel.searchedAroma = null;
    wineModel.selectedSmells = null;
    wineModel.tastes = null;
    wineModel.selectedTastes = null;
    wineModel.tasteCharacteristics = null;
    wineModel.draftTasteCharacteristics = null;
    wineModel.tasteCharacteristicDetails = null;
    wineModel.winePeak = null;
    wineModel.review = null;
};
