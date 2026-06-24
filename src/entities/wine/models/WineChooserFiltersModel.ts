import { MobXRepository } from '@/repository/MobXRepository';
import { IWineChooserFilters } from '../types/IWineChooser';

export const EMPTY_WINE_CHOOSER_FILTERS: IWineChooserFilters = {
    searchQuery: '',
    aromaIds: [],
    flavorIds: [],
    gender: null,
    ageMin: null,
    ageMax: null,
    typeIds: [],
    colorIds: [],
    minUserRating: 0,
    minExpertRating: 70,
    maxExpertRating: 100,
    countryIds: [],
    regionIds: [],
    grapeVarieties: [],
    vintages: [],
    tasteFilters: [],
};

export class WineChooserFiltersModel {
    private filtersRepository = new MobXRepository<IWineChooserFilters>(EMPTY_WINE_CHOOSER_FILTERS);

    public get filters() {
        return this.filtersRepository.data || EMPTY_WINE_CHOOSER_FILTERS;
    }

    public set filters(value: IWineChooserFilters) {
        this.filtersRepository.save(value);
    }
}

export const wineChooserMyselfFiltersModel = new WineChooserFiltersModel();
export const wineChooserFriendFiltersModel = new WineChooserFiltersModel();
